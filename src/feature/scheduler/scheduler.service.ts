import { RestaurantLib } from '../restaurant/restaurant.lib';
import { Get, Injectable, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExternalApiLib } from '../externalApi/externalApi.lib';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly externalApiLib: ExternalApiLib,
    private readonly restaurantLib: RestaurantLib,
  ) {}

  // NOTE: 레스토랑 공공데이터 업데이트 - 월~목까지 아침 5시에 벌크 업데이트 진행.
  @Cron('0 5 * * 1-4')
  async updateRestaurants(): Promise<void> {
    const transformRestaurants = await this.externalApiLib.getRestaurantsExternalApi();
    await this.restaurantLib.updateRestaurants(transformRestaurants);
  }
}
