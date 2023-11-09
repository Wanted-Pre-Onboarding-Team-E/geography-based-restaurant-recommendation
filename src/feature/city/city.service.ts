import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FailType } from '../../enum/failType.enum';
import { ExternalApiLib } from '../externalApi/externalApi.lib';

@Injectable()
export class CityService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly externalApiLib: ExternalApiLib,
  ) {
    this.externalApiLib
      .updateCities()
      .then(() => Logger.log('Cities Initialized'));
  }

  /** 시군구 조회
   * @return 시군구 목록 */
  async getCities() {
    const cachedData = await this.cacheManager.get(`city`);
    if (!cachedData) {
      throw new NotFoundException(FailType.CITY_NOT_FOUND);
    }

    return cachedData;
  }
}
