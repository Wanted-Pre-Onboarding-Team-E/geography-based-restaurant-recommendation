import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RestaurantService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  //NOTE: 서버 실행 시 한번, 이후 하루에 한번 코드 실행
  @Cron('0 0 * * * *')
  async cacheCSV() {
    const filePath = path.join(__dirname, '../../../csv', 'sgg_lat_lon.csv');
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const ds = row['ds'];
        const sgg = row['sgg'];
        const lon = parseFloat(row['lon']);
        const lat = parseFloat(row['lat']);

        this.cacheManager.set(`${ds}_${sgg}`, { lon, lat });
      })
      .on('end', () => {
        console.log('데이터를 캐시에 저장했습니다.');
      });
  }
}
