import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { SuccessType } from '../../enum/successType.enum';
import { FailType } from '../../enum/failType.enum';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/:id')
  async getRestaurantAndAddViewCountById(@Param('id') id: number) {
    const updateResult =
      await this.restaurantService.addRestaurantViewCountById(id);

    if (updateResult.affected === 0) {
      throw new NotFoundException(FailType.RESTAURANT_NOT_FOUND);
    }

    const restaurant = await this.restaurantService.getRestaurantDetailById(id);

    return {
      message: SuccessType.RESTAURANT_DETAIL_GET,
      data: restaurant,
    };
  }
}
