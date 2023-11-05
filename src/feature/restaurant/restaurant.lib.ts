import { Injectable } from '@nestjs/common';
import { Restaurant } from 'src/entity/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class RestaurantLib {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly restaurantService: RestaurantService,
  ) {}

  /**
   * 총 평점이 높은 순으로 3.0/5.0 이상의 맛집 리스트를 불러온다.
   */
  getHighTotalRatingRestaurants() {
    return this.restaurantRepository.find({
      where: { totalRating: MoreThanOrEqual(3.0) },
      order: { totalRating: 'DESC' },
    });
  }

  async updateRestaurants(restaurants: Restaurant[]): Promise<void> {
    return this.restaurantService.updateRestaurants(restaurants);
  }
}
