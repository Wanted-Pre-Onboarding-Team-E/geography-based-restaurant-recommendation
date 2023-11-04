import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

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
      .getOne();
    return restaurant;
  }

  async AddRestaurantViewCountById(id: number): Promise<any> {
    return await this.restaurantRepository
      .createQueryBuilder()
      .update(Restaurant)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('id = :id', { id })
      .execute();
  }
}
