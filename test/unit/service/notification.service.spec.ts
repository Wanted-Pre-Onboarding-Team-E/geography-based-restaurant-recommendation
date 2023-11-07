import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

import { User } from '../../../src/entity/user.entity';
import { NotificationService } from '../../../src/notification/notification.service';
import { UtilService } from '../../../src/util/util.service';
import { UserLib } from '../../../src/feature/user/user.lib';
import { RestaurantLib } from '../../../src/feature/restaurant/restaurant.lib';
import { Restaurant } from '../../../src/entity/restaurant.entity';
import { BusinessType } from '../../../src/enum/businessType.enum';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let httpService: HttpService;
  let userLib: UserLib;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUtilService = {
    // 500미터 이내의 결과만 나온다고 가정한다.
    latLonToKm: jest.fn().mockReturnValue(0.5),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockUserLib = {
    getUsersUsingRecommendation: jest.fn(),
  };

  const mockRestaurantLib = {
    getHighTotalRatingRestaurants: jest.fn().mockResolvedValue([
      {
        id: 1,
        latitude: 126.76572893614934,
        longitude: 37.67669768617949,
        businessType: BusinessType.CHINESE_FOOD,
      },
      {
        id: 2,
        latitude: 126.76517261955924,
        longitude: 37.67667605386759,
        businessType: BusinessType.JAPANESE_FOOD,
      },
    ] as Restaurant[]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UtilService, useValue: mockUtilService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: UserLib, useValue: mockUserLib },
        { provide: RestaurantLib, useValue: mockRestaurantLib },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    httpService = module.get<HttpService>(HttpService);
    userLib = module.get<UserLib>(UserLib);
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
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
        .mockImplementation(() => of(mockSuccessResponse));
      // NOTE: of() => Observable 객체 생성

      // when
      await notificationService.sendDiscordMessage();

      // then
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    test('점심 추천 서비스에 동의한 사용자가 없다면, 디스코드로 메세지 전송을 하지 않는다.', async () => {
      // given
      const mockUsers = [];

      jest
        .spyOn(userLib, 'getUsersUsingRecommendation')
        .mockResolvedValue(mockUsers);

      const postSpy = jest.spyOn(httpService, 'post');

      // when
      await notificationService.sendDiscordMessage();

      // then
      expect(postSpy).toHaveBeenCalledTimes(0);
    });

    test('점심 추천 서비스에 동의한 사용자가 있지만, 웹훅 URL이 유효하지 않은 경우 예외가 발생한다.', async () => {
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

      const mockErrorResponse = {
        status: 401,
        data: 'invalid request url',
      };

      const postSpy = jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => mockErrorResponse));

      try {
        // when
        await notificationService.sendDiscordMessage();
      } catch (error) {
        // then
        expect(postSpy).toHaveBeenCalledTimes(1);
        expect(error.response.statusCode).toBe(500);
      }
    });
  });
});
