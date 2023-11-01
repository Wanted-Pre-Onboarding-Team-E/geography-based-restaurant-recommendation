import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { ApiResult } from '../custom/apiResult';
import { SuccessType } from 'src/enum/successType.enum';

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

  @Post('/:id/review/:userId')
  async postReviewOfRestaurantById(
    //NOTE: userId 값은 추후에 Param -> Req로 변경.
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) restaurantId: number,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
  ): Promise<ApiResult<void>> {
    await this.restaurantService.postReviewOfRestaurantById(
      userId,
      restaurantId,
      createReviewDto,
    );
    return {
      success: true,
      message: SuccessType.REVIEW_SAVE,
    };
  }
}
