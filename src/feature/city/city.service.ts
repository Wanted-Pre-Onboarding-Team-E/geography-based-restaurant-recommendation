import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FailType } from '../../enum/failType.enum';
import { SchedulerService } from '../scheduler/scheduler.service';

@Injectable()
export class CityService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly schedulerService: SchedulerService,
  ) {}

  /** 시군구 조회
   * @return 시군구 목록 */
  async getCities() {
    const cachedData = await this.cacheManager.get(`city`);

    if (cachedData) {
      return cachedData;
    } else {
      await this.schedulerService.updateCities();
      const cacheData = await this.cacheManager.get(`city`);
      if (!cacheData) {
        throw new NotFoundException(FailType.CITY_NOT_FOUND);
      }

      return cacheData;
    }
  }
}
