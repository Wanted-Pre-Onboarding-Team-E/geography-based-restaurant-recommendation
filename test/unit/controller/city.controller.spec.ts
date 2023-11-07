import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CityController } from '../../../src/feature/city/city.controller';
import { CityService } from '../../../src/feature/city/city.service';
import { SuccessType } from '../../../src/enum/successType.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalApiLib } from '../../../src/feature/externalApi/externalApi.lib';

describe('CityController', () => {
  let cityController: CityController;
  let cityService = {
    getCities: jest.fn(),
  };
  let cacheManager: Cache;
  let externalApiLib: ExternalApiLib;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: cityService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
        {
          provide: ExternalApiLib,
          useValue: externalApiLib,
        },
      ],
    }).compile();
    cityController = module.get<CityController>(CityController);
  });

  it('should be defined', () => {
    expect(cityController).toBeDefined();
  });

  describe('getCities()', () => {
    it('시군구 정보 조회 성공', async () => {
      const sampleCitiesData = ['City1', 'City2', 'City3'];
      jest.spyOn(cityService, 'getCities').mockResolvedValue(sampleCitiesData);

      const result = await cityController.getCities();

      expect(result).toEqual({
        message: SuccessType.CITY_FETCH_DISTRICTS,
        data: sampleCitiesData,
      });
    });
  });
});
