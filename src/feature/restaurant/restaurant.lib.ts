import { Injectable } from '@nestjs/common';
import { Restaurant } from 'src/entity/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class RestaurantLib {
  constructor(private readonly restaurantService: RestaurantService) {}

  async updateRestaurants(restaurants: Restaurant[]): Promise<void> {
    return this.restaurantService.updateRestaurants(restaurants);
  }
}
