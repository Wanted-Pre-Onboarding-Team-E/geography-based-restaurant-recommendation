import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExternalApiLib } from '../externalApi/externalApi.lib';
import { RestaurantLib } from '../restaurant/restaurant.lib';
import { NotificationLib } from 'src/notification/notification.lib';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly externalApiLib: ExternalApiLib,
    private readonly restaurantLib: RestaurantLib,
    private readonly notificationLib: NotificationLib,
  ) {}

  // NOTE: 레스토랑 공공데이터 업데이트 - 월~목까지 아침 5시에 실행.
  @Cron('0 5 * * 1-4')
  async updateRestaurants(): Promise<void> {
    const transformRestaurants =
      await this.externalApiLib.getRestaurantsExternalApi();
    await this.restaurantLib.updateRestaurants(transformRestaurants);
  }

  // NOTE: 맛집 추천 - 월요일~금요일 오전 11시 30분에 실행
  @Cron('0 30 11 * * 1-5')
  async sendDiscordMessage() {
    await this.notificationLib.sendDiscordMessage();
  }

  // NOTE: 시군구 데이터 업데이트 - 매주 월요일 정오 실행
  @Cron('0 12 * * 1')
  async updateCities() {
    await this.externalApiLib.updateCities();
  }
}
