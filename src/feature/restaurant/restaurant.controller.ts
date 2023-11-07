import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { GetRestaurantsDto } from './dto/getRestaurant.dto';
import { SuccessType } from '../../enum/successType.enum';
import { FailType } from '../../enum/failType.enum';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  /** 맛집 조회
   * @Query 맛집 조회 쿼리
   * @return 응답 메시지 및 맛집 조회 목록 출력  */
  @Get('/')
  async getRestaurants(@Query() getRestaurantsDto: GetRestaurantsDto) {
    const restaurants =
      await this.restaurantService.getRestaurants(getRestaurantsDto);

    return {
      message: SuccessType.RESTAURANT_LIST_GET,
      data: restaurants,
    };
  }

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
