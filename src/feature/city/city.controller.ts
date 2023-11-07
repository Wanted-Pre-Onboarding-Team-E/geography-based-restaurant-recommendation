import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { SuccessType } from '../../enum/successType.enum';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  /** 시군구 조회
   * @return 응답 메시지 및 시군구 목록 출력 */
  @Get('/')
  async getCities() {
    return {
      message: SuccessType.CITY_FETCH_DISTRICTS,
      data: await this.cityService.getCities(),
    };
  }
}
