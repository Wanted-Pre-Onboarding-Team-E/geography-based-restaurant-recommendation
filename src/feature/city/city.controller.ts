import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  // FIXME: 엔드포인트 연결 여부를 확인하기 위해 임시로 작성했습니다. 함수명은 원하시는대로 수정해주세요~!
  @Get('/')
  getCities() {
    return 'GET /cities';
  }
}
