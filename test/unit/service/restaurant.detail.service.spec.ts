import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { RestaurantService } from '../../../src/feature/restaurant/restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from '../../../src/entity/restaurant.entity';
import { BusinessType } from '../../../src/enum/businessType.enum';
describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let cacheManager: Cache;
  let restaurantRepository: Repository<Restaurant>;

  const viewCount = 100;

  const CachedRestaurant = {
    id: 2,
    placeName: 'Test Restaurant',
    businessType: BusinessType.KIMBAP,
    businessState: true,
    roadNameAddress: 'Test Road 1',
    cityName: 'Test City',
    latitude: 123.456,
    longitude: 789.012,
    totalRating: 4.5,
    createdAt: new Date('11-01-05').toISOString(),
    reviews: [],
  };

  const mockRestaurant = {
    id: 2,
    placeName: 'Test Restaurant',
    businessType: BusinessType.KIMBAP,
    businessState: true,
    roadNameAddress: 'Test Road 1',
    cityName: 'Test City',
    latitude: 123.456,
    longitude: 789.012,
    totalRating: 4.5,
    createdAt: new Date('11-01-05'),
    reviews: [],
    viewCount: 100,
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    restaurantRepository = module.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  describe('addRestaurantViewCountById', () => {
    it('should increment the view count for a restaurant', async () => {
      const id = 1;
      const mockUpdateResult = { affected: 1 };

      jest.spyOn(restaurantRepository, 'createQueryBuilder').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockUpdateResult),
      } as any);

      const result = await restaurantService.addRestaurantViewCountById(id);

      expect(restaurantRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('getRestaurantDetailById', () => {
    const id = 2;

    it('should return restaurant details with updated view count when cache hit', async () => {
      const getUpdatedViewCountSpy = jest
        .spyOn(restaurantService, 'getUpdatedViewCount')
        .mockResolvedValue(mockRestaurant);
      const getCacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(CachedRestaurant));

      const result = await restaurantService.getRestaurantDetailById(id);

      expect(getUpdatedViewCountSpy).toHaveBeenCalledWith(id);
      expect(getCacheSpy).toHaveBeenCalledWith(`restaurant:${id}`);
      expect(result).toEqual({ ...CachedRestaurant, viewCount });
    });

    it('should return restaurant details and update cache when view count is greater than or equal to 100', async () => {
      const getUpdatedViewCountSpy = jest
        .spyOn(restaurantService, 'getUpdatedViewCount')
        .mockResolvedValue(mockRestaurant);

      const restaurantRepositorySpy = jest
        .spyOn(restaurantRepository, 'createQueryBuilder')
        .mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(mockRestaurant),
        } as any);

      const setCacheMock = jest.spyOn(cacheManager, 'set').mockResolvedValue();

      const result = await restaurantService.getRestaurantDetailById(id);

      expect(getUpdatedViewCountSpy).toHaveBeenCalledWith(id);
      expect(restaurantRepositorySpy).toHaveBeenCalled();
      expect(setCacheMock).toHaveBeenCalledWith(
        `restaurant:${id}`,
        JSON.stringify(CachedRestaurant),
        600,
      );
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('getUpdatedViewCount', () => {
    it('should return the updated view count for a restaurant', async () => {
      const mockId = 1;
      const expectedViewCount = 10;
      const expectedRestaurant = new Restaurant();
      expectedRestaurant.viewCount = expectedViewCount;

      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(expectedRestaurant);

      const result = await restaurantService.getUpdatedViewCount(mockId);

      expect(result).toBeDefined();
      expect(result.viewCount).toBe(expectedViewCount);
    });
  });
});
