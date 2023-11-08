import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/feature/user/user.controller';
import { UserService } from '../../../src/feature/user/user.service';
import { SuccessType } from '../../../src/enum/successType.enum';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    getUserInfo: jest.fn(),
    updateUserRecommendation: jest.fn(),
    updateUserLocation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService, // 모킹된 서비스 사용
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('getUserInfo()', async () => {
    const userInfo = {
      id: 1,
      username: 'testUser',
      isRecommended: true,
      latitude: 123.45,
      longitude: 67.89,
    };
    jest.spyOn(mockUserService, 'getUserInfo').mockResolvedValue(userInfo);

    const req = { user: { id: 1 } };
    const result = await userController.getUserInfo(req);
    expect(result).toEqual({
      message: SuccessType.USER_GET,
      data: userInfo,
    });
  });

  it('should update user recommendation', async () => {
    const updateUserDto = { isRecommended: true };
    jest
      .spyOn(mockUserService, 'updateUserRecommendation')
      .mockResolvedValue({ id: 1, isRecommended: true });

    const req = { user: { id: 1 } };

    const result = await userController.patchUsers(updateUserDto, req);

    expect(result).toEqual({
      message: SuccessType.USER_UPDATE,
      data: { id: 1, isRecommended: true },
    });
  });

  it('should update user location', async () => {
    const updateUserLocationDto = {
      latitude: 123.45,
      longitude: 67.89,
    };
    jest
      .spyOn(mockUserService, 'updateUserLocation')
      .mockResolvedValue({ id: 1, ...updateUserLocationDto });

    const req = { user: { id: 1 } };

    const result = await userController.patchUsersLocation(
      updateUserLocationDto,
      req,
    );

    expect(result).toEqual({
      message: SuccessType.USER_UPDATE,
      data: { id: 1, ...updateUserLocationDto },
    });
  });
});
