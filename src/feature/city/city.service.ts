import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FailType } from '../../enum/failType.enum';
import { ExternalApiLib } from '../externalApi/externalApi.lib';

@Injectable()
export class CityService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly externalApiLib: ExternalApiLib,
  ) {}

  /** 시군구 조회
   * @return 시군구 목록 */
  async getCities() {
    const cachedData = await this.cacheManager.get(`city`);

    if (cachedData) {
      return cachedData;
    } else {
      await this.externalApiLib.updateCities();
      const newCachedData = await this.cacheManager.get(`city`);
      if (!newCachedData) {
        throw new NotFoundException(FailType.CITY_NOT_FOUND);
      }

      return newCachedData;
    }
  }
}
