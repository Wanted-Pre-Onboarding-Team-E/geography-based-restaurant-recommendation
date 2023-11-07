import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '../../../src/feature/restaurant/restaurant.controller';
import { RestaurantService } from '../../../src/feature/restaurant/restaurant.service';
import { NotFoundException } from '@nestjs/common';
import { Restaurant } from '../../../src/entity/restaurant.entity';
import { BusinessType } from '../../../src/enum/businessType.enum';
import { SuccessType } from '../../../src/enum/successType.enum';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  const mockRestaurantService = {
    addRestaurantViewCountById: jest.fn(),
    getRestaurantDetailById: jest.fn(),
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

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should increment view count and return restaurant details', async () => {
    const mockId = 1;
    const mockUpdateResult = { affected: 1 };
    const mockRestaurantDetail: Restaurant = {
      id: 2,
      placeName: '이름2',
      businessType: BusinessType.KIMBAP,
      businessState: true,
      roadNameAddress: 'ㅇㅇㅇ',
      cityName: 'ㅇㅇㅇ',
      latitude: 0,
      longitude: 0,
      viewCount: 42431,
      totalRating: 0,
      createdAt: new Date('2023-11-05'),
      reviews: [],
    };

    jest
      .spyOn(service, 'addRestaurantViewCountById')
      .mockResolvedValue(mockUpdateResult);
    jest
      .spyOn(service, 'getRestaurantDetailById')
      .mockResolvedValue(mockRestaurantDetail);

    const result = await controller.getRestaurantAndAddViewCountById(mockId);

    expect(service.addRestaurantViewCountById).toHaveBeenCalledWith(mockId);
    expect(service.getRestaurantDetailById).toHaveBeenCalledWith(mockId);
    expect(result).toEqual({
      message: SuccessType.RESTAURANT_DETAIL_GET,
      data: mockRestaurantDetail,
    });
  });

  it('should throw NotFoundException if no restaurant found', async () => {
    const mockId = 1;
    const mockUpdateResult = { affected: 0 };

    jest
      .spyOn(service, 'addRestaurantViewCountById')
      .mockResolvedValue(mockUpdateResult);

    await expect(
      controller.getRestaurantAndAddViewCountById(mockId),
    ).rejects.toThrow(NotFoundException);
  });
});
