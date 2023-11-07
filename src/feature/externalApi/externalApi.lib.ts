import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { catchError, lastValueFrom } from 'rxjs';
import { ErrorStatus } from '../../enum/errorStatus.enum';
import { ExternalApiType } from '../../enum/externalApiType.enum';
import { FailType } from '../../enum/failType.enum';
import { Restaurant } from '../../entity/restaurant.entity';

@Injectable()
export class ExternalApiLib {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRestaurantsExternalApi(): Promise<Restaurant[]> {
    const restaurants = await this.getCombineFoods();
    const transformRestaurants = await this.transformData(restaurants);

    if (transformRestaurants.length < 1) {
      throw new HttpException(FailType.DATA_NOT_EXIST, ErrorStatus.NOT_FOUND);
    }
    return transformRestaurants;
  }

  async updateCities() {
    const filePath = path.join(__dirname, '../../../csv', 'sgg_lat_lon.csv');

    const data = [];
    fs.createReadStream(filePath)
      .on('error', (error) => {
        Logger.error(error);
      })
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
      });
  }

  // NOTE: 가게이름이랑 주소가 null인 데이터 제외, 데이터 없을 경우 기본값 처리
  private async transformData(restaurants): Promise<Restaurant[]> {
    const transformRestaurants = restaurants
      .filter(
        (restaurant) =>
          restaurant.BIZPLC_NM !== null &&
          restaurant.REFINE_LOTNO_ADDR !== null,
      )
      .map((restaurant) => ({
        placeName: restaurant.BIZPLC_NM,
        businessType: restaurant.SANITTN_BIZCOND_NM,
        businessState: restaurant.BSN_STATE_NM === '영업' ? true : false,
        roadNameAddress: restaurant.REFINE_LOTNO_ADDR,
        cityName: restaurant.SIGUN_NM ?? '',
        latitude: restaurant.REFINE_WGS84_LOGT ?? 0,
        longitude: restaurant.REFINE_WGS84_LAT ?? 0,
        viewCount: 0,
        totalRating: 0,
        licenseDate: restaurant.LICENSG_DE ?? '',
        closeDate: restaurant.CLSBIZ_DE ?? '',
        locationArea: restaurant.LOCPLC_AR ?? '',
        waterworksName: restaurant.GRAD_FACLT_DIV_NM ?? '',
        maleEmployeeCount: restaurant.MALE_ENFLPSN_CNT ?? 0,
        femaleEmployeeCount: restaurant.FEMALE_ENFLPSN_CNT ?? 0,
        year: restaurant.YY ?? '',
        multiUse: restaurant.MULTI_USE_BIZESTBL_YN ?? false,
        gradeName: restaurant.GRAD_DIV_NM ?? '',
        totalFacilityScale: restaurant.TOT_FACLT_SCALE ?? '',
        surroundingAreaName: restaurant.BSNSITE_CIRCUMFR_DIV_NM ?? '',
        industryType: restaurant.SANITTN_INDUTYPE_NM ?? '',
        totalEmployeeCount: restaurant.TOT_EMPLY_CNT ?? 0,
        lotNumberAddress: restaurant.REFINE_ROADNM_ADDR ?? '',
        zipCode: restaurant.REFINE_ZIP_CD ?? '',
        cityCode: restaurant.SIGUN_CD ?? '',
      }));

    return transformRestaurants;
  }

  // NOTE: 김밥, 일식, 중식 데이터를 합치기 위한 함수.
  private async getCombineFoods() {
    const pageCount = 1000;
    const pageIndex = 1;

    const kimbapResponse = await this.getData(
      ExternalApiType.KIMBAP,
      pageCount,
      pageIndex,
    );

    const japaneseFoodResponse = await this.getData(
      ExternalApiType.JAPANESE_FOOD,
      pageCount,
      pageIndex,
    );

    const chineseFoodResponse = await this.getData(
      ExternalApiType.CHINESE_FOOD,
      pageCount,
      pageIndex,
    );

    const combineFoods = [
      ...kimbapResponse,
      ...japaneseFoodResponse,
      ...chineseFoodResponse,
    ];

    return combineFoods;
  }

  // NOTE: 데이터를 가져오기 위한 함수.
  private async getData(
    externalApiType: ExternalApiType,
    pageCount: number,
    pageIndex: number,
  ) {
    // 1. 공공데이터 호출
    const response = await this.callExternalApi(
      externalApiType,
      pageCount,
      pageIndex,
    );

    // 2. 실제 데이터
    const rowResult = response.data[externalApiType][1].row; // 실제 데이터 [{}]
    if (rowResult.length < 1) {
      throw new HttpException(FailType.DATA_NOT_EXIST, ErrorStatus.NOT_FOUND);
    }

    // 3. 재호출을 위한 계산
    const rowTotalCount =
      response.data[externalApiType][0].head[0].list_total_count;
    const apiCallCount = Math.ceil(rowTotalCount / pageCount);

    // 4. 1 페이지를 넘어가는지 확인후 재호출
    if (apiCallCount > 1) {
      const combineResponse = await this.repeatCallExternalApi(
        pageCount,
        pageIndex,
        rowResult,
        apiCallCount,
        externalApiType,
      );
      return combineResponse;
    }
    return rowResult;
  }

  // NOTE: 외부 API를 처음 호출하는 함수.
  private async callExternalApi(
    externalApiType: ExternalApiType,
    pageCount: number,
    pageIndex?: number,
  ) {
    const openApiKey = this.configService.get<string>('OPEN_API_KEY');

    const response = await lastValueFrom(
      this.httpService
        .get(`https://openapi.gg.go.kr/${externalApiType}`, {
          params: {
            KEY: openApiKey,
            pIndex: pageIndex,
            pSize: pageCount,
            Type: 'json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error : ', error);
            throw new HttpException(
              FailType.EXTERNAL_API_CALL_FAILED,
              ErrorStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
    return response;
  }

  // NOTE: 외부 API 첫 호출(1000개)로 전부 가져오지 못할 경우 재호출하는 함수.
  private async repeatCallExternalApi(
    pageCount: number,
    pageIndex: number,
    responseObject: any,
    apiCallCount: number,
    externalApiType: ExternalApiType,
  ) {
    let upzipResponseObject = [...responseObject];

    for (let i = 1; i < apiCallCount; i++) {
      const recallResponse = await this.callExternalApi(
        externalApiType,
        pageCount,
        pageIndex + i,
      );

      const combineResponse = (externalApiType: string) => {
        switch (externalApiType) {
          case ExternalApiType.KIMBAP:
            return upzipResponseObject.concat(
              recallResponse.data.Genrestrtlunch[1].row,
            );
          case ExternalApiType.JAPANESE_FOOD:
            return upzipResponseObject.concat(
              recallResponse.data.Genrestrtjpnfood[1].row,
            );
          case ExternalApiType.CHINESE_FOOD:
            return upzipResponseObject.concat(
              recallResponse.data.Genrestrtchifood[1].row,
            );
        }
      };
      upzipResponseObject = [...combineResponse(externalApiType)];
    }

    return upzipResponseObject;
  }
}
