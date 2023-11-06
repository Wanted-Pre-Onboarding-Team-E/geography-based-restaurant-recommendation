import { Controller, Get, Res } from '@nestjs/common';
import { CityService } from './city.service';
import { SuccessType } from '../../enum/successType.enum';
import { Response } from 'express';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  /** 시군구 조회
   * @Res res 응답 클래스
   * @return 응답 메시지 및 시군구 목록 출력 */
  @Get('/')
  async getCities(@Res() res: Response) {
    return res.send({
      message: SuccessType.CITY_FETCH_DISTRICTS,
      data: await this.cityService.getCities(),
    });
  }
}
