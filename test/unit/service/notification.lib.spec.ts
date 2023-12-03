import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

import { User } from '../../../src/entity/user.entity';
import { NotificationLib } from '../../../src/notification/notification.lib';
import { UserLib } from '../../../src/feature/user/user.lib';
import { RestaurantLib } from '../../../src/feature/restaurant/restaurant.lib';
import { Restaurant } from '../../../src/entity/restaurant.entity';
import { BusinessType } from '../../../src/enum/businessType.enum';

describe('NotificationLib', () => {
  let notificationLib: NotificationLib;
  let httpService: HttpService;
  let userLib: UserLib;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockUserLib = {
    getUsersUsingRecommendation: jest.fn(),
  };

  const mockRestaurantLib = {
    getHighTotalRatingRestaurantNearUser: jest.fn().mockResolvedValue({
      id: 1,
      latitude: 126.76572893614934,
      longitude: 37.67669768617949,
      placeName: '짬뽕지존',
      businessType: BusinessType.CHINESE_FOOD,
    } as Restaurant),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationLib,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: UserLib, useValue: mockUserLib },
        { provide: RestaurantLib, useValue: mockRestaurantLib },
      ],
    }).compile();

    notificationLib = module.get<NotificationLib>(NotificationLib);
    httpService = module.get<HttpService>(HttpService);
    userLib = module.get<UserLib>(UserLib);
  });

  it('should be defined', () => {
    expect(notificationLib).toBeDefined();
  });

  describe('sendDiscordMessage()', () => {
    let postSpy;

    afterEach(() => {
      postSpy.mockRestore();
    });

    test('점심 추천 서비스에 동의한 사용자가 있다면, 디스코드로 메세지 전송 요청에 성공한다.', async () => {
      // given
      const mockUsers = [
        {
          id: 1,
          username: 'test1',
          password: 'encrypted_password',
          isRecommended: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'test2',
          password: 'encrypted_password',
          isRecommended: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(userLib, 'getUsersUsingRecommendation')
        .mockResolvedValue(mockUsers as User[]);

      const mockSuccessResponse = { statusText: '204' } as AxiosResponse;

      postSpy = jest
        .spyOn(httpService, 'post')
        // NOTE: of() => Observable 객체 생성
        .mockImplementation(() => of(mockSuccessResponse));

      // when
      await notificationLib.sendDiscordMessage();

      // then
      expect(postSpy).toHaveBeenCalledTimes(mockUsers.length);
    });

    test('점심 추천 서비스에 동의한 사용자가 없다면, 디스코드로 메세지 전송을 하지 않는다.', async () => {
      // given
      const mockUsers = [];

      jest
        .spyOn(userLib, 'getUsersUsingRecommendation')
        .mockResolvedValue(mockUsers);

      postSpy = jest.spyOn(httpService, 'post');

      // when
      await notificationLib.sendDiscordMessage();

      // then
      expect(postSpy).toHaveBeenCalledTimes(0);
    });
  });
});
