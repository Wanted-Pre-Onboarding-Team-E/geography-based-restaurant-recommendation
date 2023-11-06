import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron } from '@nestjs/schedule';

import * as fs from 'fs';
import * as path from 'path';
import { Cache } from 'cache-manager';
import * as csv from 'csv-parser';

import { FailType } from '../../enum/failType.enum';

@Injectable()
export class CityService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.cacheCSV().then(() => {
      console.log('init');
    });
  }

  /** 시군구 조회
   * @return 시군구 목록 */
  async getCities() {
    const cachedData = await this.cacheManager.get(`city`);

    if (cachedData) {
      return cachedData;
    } else {
      await this.cacheCSV();
      const cacheData = await this.cacheManager.get(`city`);
      if (!cacheData) {
        throw new NotFoundException(FailType.CITY_NOT_FOUND);
      }

      return cacheData;
    }
  }

  @Cron('0 0 * * * *')
  async cacheCSV() {
    const filePath = path.join(__dirname, '../../../csv', 'sgg_lat_lon.csv');

    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push({
          city: row['do-si'],
          district: row['sgg'],
          latitude: row['lat'],
          longitude: row['lon'],
        });
      })
      .on('end', () => {
        this.cacheManager.set(`city`, data);
      })
      .on('error', (error) => {
        Logger.error(error.message);
      });
  }
}
