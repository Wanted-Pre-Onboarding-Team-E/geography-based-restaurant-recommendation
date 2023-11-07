import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../../src/feature/user/user.service';
import { UserLib } from '../../../src/feature/user/user.lib';
import { FailType } from '../../../src/enum/failType.enum';
import { User } from '../../../src/entity/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let mockUserLib = {
    getUserById: jest.fn(),
    updateUserRecommendation: jest.fn(),
    updateUserLocation: jest.fn(),
  };
  let mockUserRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserLib,
          useValue: mockUserLib,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getUserInfo()', () => {
    it('사용자 조회 완료', async () => {
      const userInfo = {
        id: 1,
        username: 'testUser',
        isRecommended: true,
      };
      jest.spyOn(mockUserLib, 'getUserById').mockResolvedValue(userInfo);

      const result = await userService.getUserInfo(1);

      expect(result).toEqual(userInfo);
    });

    it('존재하지 않는 사용자', async () => {
      jest.spyOn(mockUserLib, 'getUserById').mockResolvedValue(undefined);

      try {
        await userService.getUserInfo(1);
        fail('Expected UnauthorizedException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(FailType.USERNAME_NOT_EXIST);
      }
    });
  });

  describe('updateUserRecommendation()', () => {
    it('사용자 점심 추천 여부 업데이트 완료', async () => {
      const id = 1;
      const isRecommended = true;
      const mockUpdateUserRecommendation = jest
        .spyOn(mockUserLib, 'updateUserRecommendation')
        .mockResolvedValue({ raw: [], generatedMaps: [], affected: 1 });

      await userService.updateUserRecommendation(id, isRecommended);

      expect(mockUpdateUserRecommendation).toHaveBeenCalledWith(
        id,
        isRecommended,
      );
    });

    it('사용자 점심 추천 여부 업데이트 실패', async () => {
      jest
        .spyOn(mockUserLib, 'updateUserRecommendation')
        .mockResolvedValue({ affected: 0 });

      try {
        await userService.updateUserRecommendation(1, true);
        fail('Expected BadRequestException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(FailType.USER_UPDATE_FAILED);
      }
    });
  });

  describe('updateUserLocation()', () => {
    it('사용자 위치 업데이트', async () => {
      const id = 1;
      const updateUserLocationDto = {
        latitude: 123.45,
        longitude: 67.89,
      };
      const mockUpdateUserLocation = jest
        .spyOn(mockUserLib, 'updateUserLocation')
        .mockResolvedValue({ raw: [], generatedMaps: [], affected: 1 });

      await userService.updateUserLocation(id, updateUserLocationDto);

      expect(mockUpdateUserLocation).toHaveBeenCalledWith(
        id,
        updateUserLocationDto,
      );
    });

    it('사용자 위치 업데이트 실패', async () => {
      jest
        .spyOn(mockUserLib, 'updateUserLocation')
        .mockResolvedValue({ affected: 0 });

      try {
        await userService.updateUserLocation(1, {
          latitude: 123.45,
          longitude: 67.89,
        });
        fail('Expected BadRequestException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(FailType.USER_UPDATE_FAILED);
      }
    });
  });
});
