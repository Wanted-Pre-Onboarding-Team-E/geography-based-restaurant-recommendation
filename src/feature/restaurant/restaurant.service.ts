import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async updateRestaurants(restaurants: Restaurant[]): Promise<void> {
    await this.restaurantRepository.upsert(restaurants, ['roadNameAddress']);
  }
}
