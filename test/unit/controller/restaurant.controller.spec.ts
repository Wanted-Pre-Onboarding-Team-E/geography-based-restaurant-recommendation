import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '../../../src/feature/restaurant/restaurant.controller';
import { RestaurantService } from '../../../src/feature/restaurant/restaurant.service';

describe('RestaurantController', () => {
  let controller: RestaurantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [RestaurantService],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
