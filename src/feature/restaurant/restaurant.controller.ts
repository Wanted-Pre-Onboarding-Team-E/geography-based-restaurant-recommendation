import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { SuccessType } from '../../enum/successType.enum';
import { FailType } from '../../enum/failType.enum';
import { Response } from 'express';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  /** 맛집 조회
   * @Query lat 위도
   * @Query lon 경도
   * @Query range 거리
   * @Query sortBy 정렬 종류
   * @Query orderBy 정렬 방식
   * @Query search 검색어
   * @Query pageCount 페이지 당 개수
   * @Query page 패이지
   * @Res res 응답 클래스
   * @return 응답 메시지 및 맛집 조회 목록 출력  */
  @Get('/')
  async getRestaurants(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('range') range: number,
    @Query('sortBy') sortBy: 'distance' | 'total_rating' = 'distance',
    @Query('orderBy') orderBy: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search: string = '',
    @Query('pageCount') pageCount: number = 10,
    @Query('page') page: number = 1,
    @Res() res: Response,
  ) {
    console.log(lat, lon, range, sortBy, orderBy, search, pageCount, page);
    const restaurants = await this.restaurantService.getRestaurants(
      lat,
      lon,
      range,
      sortBy,
      orderBy,
      search,
      pageCount,
      page,
    );

    return res.send({
      message: SuccessType.RESTAURANT_LIST_GET,
      data: restaurants,
    });
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
