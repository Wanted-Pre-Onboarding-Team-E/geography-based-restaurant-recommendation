import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { BusinessType } from '../enum/businessType.enum';
import { FailType } from '../enum/failType.enum';
import { UserLib } from '../feature/user/user.lib';
import { RestaurantLib } from '../feature/restaurant/restaurant.lib';

@Injectable()
export class NotificationLib {
  private readonly discordWebhookUrl: string;
  private readonly logger = new Logger(NotificationLib.name);

  constructor(
    private readonly configService: ConfigService,
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

  async sendDiscordMessage() {
    // 1. 맛집 추천 서비스를 이용하는 고객만 조회한다.
    const users = await this.userLib.getUsersUsingRecommendation();
    if (users.length === 0) {
      this.logger.log('메세지를 전송할 사용자가 없습니다.');
      return;
    }

    // NOTE: { 맛집 조회 -> 메세지 전송 } 과정에서 Promise를 논 블로킹으로 실행
    //       Promise.allSettled() => 어떤 Promise가 reject 되더라도 나머지는 이행 결과 받을 수 있음
    Promise.allSettled(
      users.map(async (user) => {
        // 2. 사용자별 추천 맛집 조회
        const recommended =
          await this.restaurantLib.getHighTotalRatingRestaurantNearUser(
            user.latitude,
            user.longitude,
          );

        // 3. 사용자별 전송할 메세지 구성
        // NOTE: 웹 크롤링 등의 전처리 과정으로 식당별 메뉴 정보를 가져왔다고 가정합니다.
        const menu = this.preprocessMenu(recommended.businessType);

        const embeddedMessage = {
          author: {
            name: `✨ ${user.username}님을 위한 추천`,
          },
          title: `${recommended.placeName}`,
          description: `${
            recommended.businessType === BusinessType.CHINESE_FOOD
              ? '🇨🇳 중국음식점'
              : recommended.businessType === BusinessType.JAPANESE_FOOD
              ? '🇯🇵 일본음식점'
              : '🇰🇷 김밥전문점'
          }`,
          fields: menu.map((m) => {
            return {
              name: m.name,
              value: m.price,
            };
          }),
        };

        // 3. 사용자별 메세지 전송
        firstValueFrom(
          this.httpService.post(this.discordWebhookUrl, {
            username: '오늘 점심 뭐 먹지?',
            avatar_url:
              'https://cdn.pixabay.com/photo/2016/10/08/18/35/restaurant-1724294_1280.png',
            content: '오늘의 점심 추천 맛집은? 🍛',
            embeds: [embeddedMessage],
          }),
        ).catch((error: AxiosError) => {
          if (error.status !== 204) {
            const data = error.response.data as any;
            const request = error.response.request;

            const errorLogMessage = {
              code: data?.code,
              message: data?.message,
              url: request.path,
              username: user.username,
            };
            this.logger.error(
              `${FailType.DICORD_MESSAGE_SEND} : ${JSON.stringify(
                errorLogMessage,
              )}`,
            );
          }
        });
      }),
    );
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
