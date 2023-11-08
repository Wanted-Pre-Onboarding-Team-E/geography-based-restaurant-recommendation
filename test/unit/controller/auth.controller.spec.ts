import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthController } from '../../../src/feature/auth/auth.controller';
import { AuthService } from '../../../src/feature/auth/auth.service';
import { SignUpUserDto } from '../../../src/feature/auth/dto/signUpUser.dto';
import { SignInUserDto } from '../../../src/feature/auth/dto/signInUser.dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    verifyUser: jest.fn(),
    checkUserExists: jest.fn(),
    checkPasswordValidate: jest.fn(),
    createUser: jest.fn(),
    getAccessToken: jest.fn(),
  };

  const mockJwtService = {};

  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: mockAuthService, // 모킹된 서비스 사용
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // 모킹된 서비스 사용
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  test('signUser()', async () => {
    const testSignUpUserDto: SignUpUserDto = {
      username: 'test0123',
      password: 'helloWorld123@',
      confirmPassword: 'helloWorld123@',
    };

    const checkUserExistsSpy = jest
      .spyOn(mockAuthService, 'checkUserExists')
      .mockResolvedValue(null);

    const checkPasswordValidateSpy = jest
      .spyOn(mockAuthService, 'checkPasswordValidate')
      .mockResolvedValue(testSignUpUserDto.password);

    const createUserSpy = jest
      .spyOn(mockAuthService, 'createUser')
      .mockResolvedValue(testSignUpUserDto);

    await authController.signUp(testSignUpUserDto);

    expect(checkUserExistsSpy).toHaveBeenCalledTimes(1);
    expect(checkPasswordValidateSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith(testSignUpUserDto);
  });

  test('사용자 정보가 일치하면 User 객체를 반환한다.', async () => {
    const testSignInUserDto: SignInUserDto = {
      username: 'test',
      password: '1234',
    };
    const mockUser = {
      id: 1,
      username: testSignInUserDto.username,
      password: testSignInUserDto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const verifyUserSpy = jest
      .spyOn(mockAuthService, 'verifyUser')
      .mockResolvedValue(mockUser);

    const signAsyncSpy = jest
      .spyOn(mockAuthService, 'getAccessToken')
      .mockResolvedValue({ id: mockUser.id, username: mockUser.username });

    const response = await authController.signIn(
      testSignInUserDto,
      mockResponse,
    );

    expect(verifyUserSpy).toHaveBeenCalledTimes(1);
    expect(signAsyncSpy).toHaveBeenCalledTimes(1);

    expect(response.cookie).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalled();
  });
});
