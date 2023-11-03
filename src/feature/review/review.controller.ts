import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResult } from '../custom/apiResult';
import { CreateReviewDto } from '../restaurant/dto/CreateReviewDto';
import { SuccessType } from 'src/enum/successType.enum';
import { ReviewService } from './review.service';

@Controller('restaurants')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/:restaurantId/review/:userId')
  async postReviewOfRestaurantById(
    //NOTE: userId 값은 추후에 Param -> Req로 변경.
    @Param('userId', ParseIntPipe) userId: number,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
  ): Promise<ApiResult<void>> {
    await this.reviewService.postReviewOfRestaurantById(
      userId,
      restaurantId,
      createReviewDto,
    );
    return {
      message: SuccessType.REVIEW_SAVE,
    };
  }
}
