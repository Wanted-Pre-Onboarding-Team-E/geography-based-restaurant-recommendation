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
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        placeName: true,
        businessType: true,
        businessState: true,
        roadNameAddress: true,
        cityName: true,
        latitude: true,
        longitude: true,
        viewCount: true,
        totalRating: true,
        reviews: {
          id: true,
          rating: true,
          content: true,
          user: {
            id: true,
            username: true,
          },
        },
      },
      relations: {
        reviews: {
          user: true,
        },
      },
    });
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
