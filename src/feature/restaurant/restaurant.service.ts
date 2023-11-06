import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';
import { UtilService } from '../../util/util.service';
import { FailType } from '../../enum/failType.enum';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly utilService: UtilService,
  ) {}

  async getRestaurants(
    lat: number,
    lon: number,
    range: number,
    sortBy: 'distance' | 'total_rating',
    orderBy: 'ASC' | 'DESC',
    search: string = '',
    pageCount: number,
    page: number,
  ) {
    if (!lat || !lon) {
      throw new BadRequestException(FailType.RESTAURANT_LOCATION_REQUIRE);
    }

    return await this.restaurantRepository
      .createQueryBuilder('r')
      .select(`r.id`, `id`)
      .addSelect(`r.placeName`, `placeName`)
      .addSelect(`r.business_type`, `business_type`)
      .addSelect(`r.business_state`, `business_state`)
      .addSelect(`r.road_name_address`, `road_name_address`)
      .addSelect(`r.city_name`, `city_name`)
      .addSelect(`r.latitude`, `latitude`)
      .addSelect(`r.longitude`, `longitude`)
      .addSelect(`r.view_count`, `view_count`)
      .addSelect(`r.total_rating`, `total_rating`)
      .where(`r.placeName LIKE :placeName`, {
        placeName: `%${search}%`,
      })
      .limit(pageCount)
      .offset((page - 1) * pageCount)
      .getRawMany()
      .then((result: any[]) => {
        return result
          .filter((item) => {
            return (
              this.utilService.latLonToKm(
                [item.latitude, item.longitude],
                [lat, lon],
              ) <
              range * 1000
            );
          })
          .map((item) => {
            return {
              ...item,
              distance: this.utilService.latLonToKm(
                [item.latitude, item.longitude],
                [lat, lon],
              ),
            };
          })
          .sort((a, b) =>
            orderBy === 'DESC'
              ? b[`${sortBy}`] - a[`${sortBy}`]
              : a[`${sortBy}`] - b[`${sortBy}`],
          );
      });
  }

  async updateRestaurants(restaurants: Restaurant[]): Promise<void> {
    await this.restaurantRepository.upsert(restaurants, ['roadNameAddress']);
  }

  async getRestaurantDetailById(id: number): Promise<Restaurant> {
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
        'user.id',
        'user.username',
      ])
      .where('restaurant.id = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .getOne();
    return restaurant;
  }

  async addRestaurantViewCountById(id: number): Promise<any> {
    return await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id });
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
