import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';

@Injectable()
export class RestaurantLib {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * 총 평점이 높은 순으로 3.0/5.0 이상의 맛집 리스트를 불러온다.
   * @return Restaurant 객체 배열
   */
  getHighTotalRatingRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { totalRating: MoreThanOrEqual(3.0) },
      order: { totalRating: 'DESC' },
    });
  }
}
