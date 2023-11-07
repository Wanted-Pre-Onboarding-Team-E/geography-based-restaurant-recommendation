import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '../../../src/feature/restaurant/restaurant.controller';
import { RestaurantService } from '../../../src/feature/restaurant/restaurant.service';
import { GetRestaurantsDto } from '../../../src/feature/restaurant/dto/getRestaurant.dto';
import { SuccessType } from '../../../src/enum/successType.enum';

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let mockRestaurantService = {
    getRestaurants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    restaurantController =
      module.get<RestaurantController>(RestaurantController);
  });

  it('should be defined', () => {
    expect(restaurantController).toBeDefined();
  });

  describe('getRestaurants()', () => {
    it('맛집 조회', async () => {
      const sampleRestaurants = ['Restaurant1', 'Restaurant2', 'Restaurant3'];
      jest
        .spyOn(mockRestaurantService, 'getRestaurants')
        .mockResolvedValue(sampleRestaurants);

      const lat = 123.45;
      const lon = 67.89;
      const getRestaurantsDto: GetRestaurantsDto = {
        range: 1000,
        sortBy: 'distance',
        orderBy: 'ASC',
        search: 'restaurant',
        pageCount: 10,
        page: 1,
      };

      const result = await restaurantController.getRestaurants(
        lat,
        lon,
        getRestaurantsDto,
      );

      expect(result).toEqual({
        message: SuccessType.RESTAURANT_LIST_GET,
        data: sampleRestaurants,
      });

      expect(mockRestaurantService.getRestaurants).toHaveBeenCalledWith(
        lat,
        lon,
        getRestaurantsDto,
      );
    });
  });
});
