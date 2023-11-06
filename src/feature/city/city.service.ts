import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class CityService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.cacheCSV().then(() => {
      console.log('init');
    });
  }

  async selectCities() {
    const cachedData = await this.cacheManager.get(`city`);

    if (cachedData) {
      return cachedData;
    } else {
      return this.cacheCSV();
    }
  }

  @Cron('0 0 * * * *')
  async cacheCSV() {
    const filePath = path.join(__dirname, '../../../csv', 'sgg_lat_lon.csv');

    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        console.log(row);
        data.push({
          city: row['\u200Bdo-si'],
          district: row['sgg'],
          latitude: row['lat'],
          longitude: row['lon'],
        });
      })
      .on('end', () => {
        this.cacheManager.set(`city`, data);
        return this.cacheManager.get(`city`);
      });
  }
}
