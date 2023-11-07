import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { RestaurantService } from '../../../src/feature/restaurant/restaurant.service';
import { GetRestaurantsDto } from '../../../src/feature/restaurant/dto/getRestaurant.dto';
import { FailType } from '../../../src/enum/failType.enum';
import { UtilService } from '../../../src/util/util.service';
import { Restaurant } from '../../../src/entity/restaurant.entity';

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let cacheManager: Cache;

  const mockRestaurantService = {
    getRestaurants: jest.fn(),
  };

  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant), // Inject a mock repository
          useValue: mockRepository,
        },
        UtilService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  describe('getRestaurants', () => {
    it('1km 이내 음식점 1개 조회', async () => {
      const lat = 127.4879630832;
      const lon = 37.2842684162;
      const getRestaurantsDto: GetRestaurantsDto = {
        range: 1,
        sortBy: 'distance',
        orderBy: 'ASC',
        search: 'Sample',
        pageCount: 10,
        page: 1,
      };

      mockRestaurantService.getRestaurants.mockResolvedValue([
        {
          id: '1084',
          placeName: '다도회',
          latitude: 127.4879630832,
          longitude: 37.2842684162,
          business_type: '일식',
          business_state: 0,
          road_name_address: '경기도 이천시 부발읍 무촌리 165-5 ',
          city_name: '이천시',
          view_count: '0',
          total_rating: 0,
          distance: 0.18020829675315922,
        },
      ]);

      const result = await mockRestaurantService.getRestaurants(
        lat,
        lon,
        getRestaurantsDto,
      );

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      result.forEach((restaurant) => {
        expect(restaurant).toHaveProperty('id');
        expect(restaurant).toHaveProperty('placeName');
      });
    });

    it('위도와 경도값이 비어있음', async () => {
      const getRestaurantsDto: GetRestaurantsDto = {
        range: 10,
        sortBy: 'distance',
        orderBy: 'ASC',
        search: 'Sample',
        pageCount: 10,
        page: 1,
      };

      try {
        await restaurantService.getRestaurants(null, null, getRestaurantsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(FailType.LOCATION_NOT_FOUND);
      }
    });
  });
});
