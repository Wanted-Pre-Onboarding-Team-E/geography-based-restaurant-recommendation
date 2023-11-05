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
    private restaurantRepository: Repository<Restaurant>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getRestaurantDetailById(id: number): Promise<Restaurant> {
    const cachedRestaurant = await this.cacheManager.get(`restaurant:${id}`);

    if (cachedRestaurant) {
      const dbViewCount = await this.getUpdatedViewCount(id);
      return { cachedRestaurant, viewCount: dbViewCount };
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

    if (restaurant) {
      const { viewCount, ...rest } = restaurant;
      await this.cacheManager.set(`restaurant:${id}`, JSON.stringify(rest));
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

  async addRestaurantViewCountById(id: number): Promise<any> {
    return await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id })
      .execute();
  }
}
