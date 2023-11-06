import { Controller, Get, Res } from '@nestjs/common';
import { CityService } from './city.service';
import { SuccessType } from '../../enum/successType.enum';
import { Response } from 'express';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/')
  async getCities(@Res() res: Response) {
    return res.send({
      message: SuccessType.CITY_FETCH_DISTRICTS,
      data: await this.cityService.selectCities(),
    });
  }
}
