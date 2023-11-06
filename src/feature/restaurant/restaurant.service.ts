import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async addRestaurantViewCountById(id: number): Promise<any> {
    return await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getRestaurantDetailById(id: number): Promise<Restaurant> {
    const { viewCount } = await this.getUpdatedViewCount(id);

    const cachedRestaurant = await this.cacheManager.get(`restaurant:${id}`);

    if (cachedRestaurant) {
      const parsedData = JSON.parse(cachedRestaurant as string);
      parsedData.viewCount = viewCount;
      return parsedData;
    }

    const restaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.reviews', 'review')
      .leftJoinAndSelect('review.user', 'user')
      .select([
        'restaurant.id',
        'restaurant.placeName',
        'restaurant.businessType',
        'restaurant.businessState',
        'restaurant.roadNameAddress',
        'restaurant.cityName',
        'restaurant.latitude',
        'restaurant.longitude',
        'restaurant.viewCount',
        'restaurant.totalRating',
        'review.id',
        'review.rating',
        'review.content',
        'review.createdAt',
        'user.id',
        'user.username',
      ])
      .where('restaurant.id = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .getOne();

    if (viewCount >= 100) {
      const { viewCount, ...rest } = restaurant;
      void viewCount;
      await this.cacheManager.set(
        `restaurant:${id}`,
        JSON.stringify(rest),
        600,
      );
    }

    return restaurant;
  }

  async getUpdatedViewCount(id: number): Promise<Restaurant> {
    return await this.restaurantRepository.findOne({
      where: {
        id,
      },
      select: {
        viewCount: true,
      },
    });
  }

  async findOneBy(restaurantId: number): Promise<Restaurant> {
    return await this.restaurantRepository.findOneBy({ id: restaurantId });
  }

  async updateRestaurant(avgRating, restaurantId): Promise<void> {
    await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ totalRating: avgRating })
      .where('id = :restaurantId', { restaurantId })
      .execute();
  }
}
