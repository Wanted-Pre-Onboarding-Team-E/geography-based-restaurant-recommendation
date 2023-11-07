import { NotFoundException } from '@nestjs/common';
import { CityService } from '../../../src/feature/city/city.service';
import { FailType } from '../../../src/enum/failType.enum';

describe('CityService', () => {
  let cityService: CityService;
  let cacheManager: any; // Mocked cacheManager
  let externalApiLib: any;

  beforeEach(() => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    externalApiLib = {
      updateCities: jest.fn(),
    };

    cityService = new CityService(cacheManager, externalApiLib);
  });

  it('should be defined', () => {
    expect(cityService).toBeDefined();
  });

  describe('getCities', () => {
    it('캐시 데이터로 시군구 조회', async () => {
      const cachedData = ['City1', 'City2', 'City3'];
      cacheManager.get.mockResolvedValue(cachedData);

      const result = await cityService.getCities();

      expect(result).toEqual(cachedData);
      expect(cacheManager.get).toHaveBeenCalledWith('city');
    });

    it('캐시 데이터가 없고, 시군구 csv 파일까지 문제가 있을 경우', async () => {
      cacheManager.get.mockResolvedValue(null);
      externalApiLib.updateCities.mockResolvedValue(null);

      try {
        await cityService.getCities();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(FailType.CITY_NOT_FOUND);
      }
    });
  });
});
