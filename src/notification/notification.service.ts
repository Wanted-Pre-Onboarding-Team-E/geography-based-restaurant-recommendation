import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { Restaurant } from '../entity/restaurant.entity';
import { BusinessType } from '../enum/businessType.enum';
import { FailType } from '../enum/failType.enum';
import { UserLib } from '../feature/user/user.lib';
import { RestaurantLib } from '../feature/restaurant/restaurant.lib';
import { UtilService } from '../util/util.service';

@Injectable()
export class NotificationService {
  private readonly discordWebhookUrl: string;
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
    private readonly httpService: HttpService,
    private readonly userLib: UserLib,
    private readonly restaurantLib: RestaurantLib,
  ) {
    // NOTE: 실제 서비스라면 사용자별 채널로 전송해야 하지만
    //       여기서는 한 개의 채널로 여러 사용자가 알림을 받는다고 가정합니다.
    this.discordWebhookUrl = this.configService.get<string>(
      'DISCORD_WEBHOOK_URL',
    );
  }

  // NOTE: 월요일~금요일 오전 11시 30분에 실행
  @Cron('0 30 11 * * 1-5')
  async sendDiscordMessage() {
    // 1. 맛집 추천 서비스를 이용하는 고객만 조회한다.
    const users = await this.userLib.getUsersUsingRecommendation();
    if (users.length === 0) {
      this.logger.log('메세지를 전송할 사용자가 없습니다.');
      return;
    }

    // 2. 총평점이 높은 순으로 맛집을 조회한다.
    const restaurants =
      await this.restaurantLib.getHighTotalRatingRestaurants();

    // 3. 사용자별 추천할 맛집 선정
    const userRestaurantMap = users.reduce((map, user) => {
      // 3-1. 사용자의 현재 위도/경도와 맛집의 위도/경도를 비교해서 반경 500m 이내의 맛집을 걸러낸다.
      const restaurantsWithin500m = restaurants.filter(
        ({ latitude, longitude }) => {
          const distance = this.utilService.latLonToKm(
            [user.latitude, user.longitude],
            [latitude, longitude],
          );
          return distance <= 0.5;
        },
      );

      // 3-2. 사용자별로 추천할 랜덤 맛집 1개 지정
      const randomRestaurant =
        restaurantsWithin500m[
          Math.floor(Math.random() * restaurantsWithin500m.length)
        ];
      map.set(user.username, randomRestaurant);
      return map;
    }, new Map());

    // 4. 디스코드 메세지에 들어갈 내용을 구성한다.
    const recommendationPerUser = [];
    userRestaurantMap.forEach((restaurant: Restaurant, username: string) => {
      // NOTE: 웹 크롤링 등의 전처리 과정으로 식당별 메뉴 정보를 가져왔다고 가정합니다.
      const menu = this.preprocessMenu(restaurant.businessType);

      recommendationPerUser.push({
        author: {
          name: `✨ ${username}님을 위한 추천`,
        },
        title: `${restaurant.placeName}`,
        description: `${
          restaurant.businessType === BusinessType.CHINESE_FOOD
            ? '🇨🇳 중국음식점'
            : restaurant.businessType === BusinessType.JAPANESE_FOOD
            ? '🇯🇵 일본음식점'
            : '🇰🇷 김밥전문점'
        }`,
        fields: menu.map((m) => {
          return {
            name: m.name,
            value: m.price,
          };
        }),
      });
    });

    // 5. 디스코드 URL과 연결된 채널로 메시지를 보낸다.
    try {
      await firstValueFrom(
        this.httpService.post(this.discordWebhookUrl, {
          username: '오늘 점심 뭐 먹지?',
          avatar_url:
            'https://cdn.pixabay.com/photo/2016/10/08/18/35/restaurant-1724294_1280.png',
          content: '오늘의 점심 추천 맛집은? 🍛',
          embeds: recommendationPerUser,
        }),
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(FailType.DICORD_MESSAGE_SEND);
    }
  }

  // NOTE: 웹 크롤링 등의 전처리 과정으로 식당별 메뉴 정보를 가져왔다고 가정합니다.
  //       따라서 맛집의 위생업태명(BusinessType)별로 메뉴의 이름과 가격이 하드코딩 되어있습니다.
  private preprocessMenu(
    businessType: BusinessType,
  ): Array<{ name: string; price: string }> {
    let menu;

    switch (businessType) {
      case BusinessType.CHINESE_FOOD:
        menu = [
          { name: '차돌짬뽕', price: '10000원' },
          { name: '볶음밥', price: '8000원' },
          { name: '간짜장', price: '7000원' },
        ];
        break;
      case BusinessType.JAPANESE_FOOD:
        menu = [
          { name: '1인 초밥세트', price: '12900원' },
          { name: '우동+초밥 세트', price: '11900원' },
          { name: '연어회 1인분', price: '16900원' },
        ];
        break;
      case BusinessType.KIMBAP:
        menu = [
          { name: '라볶이', price: '5500원' },
          { name: '참치김밥', price: '4000원' },
          { name: '돈까스', price: '8500원' },
        ];
        break;
    }
    return menu;
  }
}
