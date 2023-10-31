import { Controller, Get, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  // FIXME: 엔드포인트 연결 여부를 확인하기 위해 임시로 작성했습니다. 함수명은 원하시는대로 수정해주세요~!
  @Get('/')
  getRestaurants() {
    return 'GET /restaurants';
  }

  @Get('/:id')
  getRestaurantsById() {
    return 'GET /restaurants/:id';
  }

  @Post('/:id/review')
  postReviewOfRestaurantById() {
    return 'POST /restaurants/:id/review';
  }
}
