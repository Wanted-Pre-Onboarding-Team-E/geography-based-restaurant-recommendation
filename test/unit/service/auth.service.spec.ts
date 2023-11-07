import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { AuthService } from '../../../src/feature/auth/auth.service';
import { User } from '../../../../social-media-integration-feed/src/entity/user.entity';
import { SignUpUserDto } from '../../../src/feature/auth/dto/signUpUser.dto';
import { SignInUserDto } from '../../../src/feature/auth/dto/signInUser.dto';

describe('AuthService', () => {
  let authService: AuthService;
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockAuthCodeRepository = {
    save: jest.fn(),
  };

  const mockJwtService = {};
  const mockDataSource = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  test('createUser(): 사용자 회원가입', async () => {
    const signUpUserDto: SignUpUserDto = {
      username: 'test01',
      password: 'helloWorld123@',
      confirmPassword: 'helloWorld123@',
    };
    const mockAuthCode = {
      username: 'creator98',
      code: '123456',
    };

    const saveAuthCodeSpy = jest
      .spyOn(mockAuthCodeRepository, 'save')
      .mockResolvedValue(mockAuthCode);
    const saveUserSpy = jest
      .spyOn(mockUserRepository, 'save')
      .mockResolvedValue(signUpUserDto);

    const authCodeResult = await mockAuthCodeRepository.save(mockAuthCode);

    const userResult = await mockUserRepository.save(
      mockUserRepository.create(signUpUserDto),
    );

    expect(saveAuthCodeSpy).toHaveBeenCalledTimes(1);
    expect(authCodeResult).toEqual(mockAuthCode);

    expect(saveUserSpy).toHaveBeenCalledTimes(1);
    expect(userResult).toEqual(signUpUserDto);
  });

  describe('checkUserExists(): 사용자 회원가입 username 유효성 확인', () => {
    test('가입할 수 있는 계정', async () => {
      const username = 'existingUser';
      mockUserRepository.findOne.mockResolvedValue(null);

      expect(await authService.checkUserExists(username));
    });

    test('이미 존재하는 계정이라 에러 발생', async () => {
      const username = 'existingUser';
      const existingUser = {
        username,
        password: 'hashedPassword',
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      try {
        await authService.checkUserExists(username);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('이미 존재하는 계정입니다.');
      }
    });
  });

  describe('checkPasswordValidate(): 사용자 회원가입 password 유효성 확인', () => {
    test('유효한 패스워드', async () => {
      const testPassword = 'helloWorld123@';

      expect(testPassword.length).toBeGreaterThanOrEqual(10);
      expect(
        [
          /[a-zA-Z]/.test(testPassword),
          /\d/.test(testPassword),
          /[!@#$%^&*]/.test(testPassword),
        ].filter(Boolean).length,
      ).toBeGreaterThanOrEqual(2);
      expect(!/(\w)\1\1/.test(testPassword));
    });

    test('숫자, 문자, 특수문자 중 2가지 미만 사용하여 에러 발생', async () => {
      const testPassword = 'helloWorld';

      try {
        const passwordTypeCountValid =
          [
            /[a-zA-Z]/.test(testPassword),
            /\d/.test(testPassword),
            /[!@#$%^&*]/.test(testPassword),
          ].filter(Boolean).length > 2;
        expect(passwordTypeCountValid).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          '비밀번호는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야하 합니다.',
        );
      }
    });

    test('3회 이상 연속되는 문자 사용하여 에러 발생', async () => {
      const testPassword = 'hello111@@';

      try {
        const passwordTypeCountValid = !/(\w)\1\1/.test(testPassword);
        expect(passwordTypeCountValid).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          '비밀번호는 3회 이상 연속되는 문자 사용은 불가능합니다.',
        );
      }
    });

    test('비밀번호와 비밀번호 확인이 일치하지 않아 에러 발생', async () => {
      const password = 'myPassword@@';
      const confirmPassword = 'wrongPassword@@';

      try {
        await authService.checkPasswordValidate(password, confirmPassword);
        fail('Expected ConflictException but got no exception');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        );
      }
    });
  });

  describe('verifyUser(): 사용자 로그인', () => {
    let findOneBySpy;
    afterEach(() => {
      findOneBySpy.mockRestore();
    });

    test('사용자 정보가 일치하여 User 객체 반환.', async () => {
      const testLoginDto = {
        username: 'test',
        password: '1234',
      } as SignInUserDto;

      const mockUser = {
        id: 1,
        username: testLoginDto.username,
        password:
          '$2y$10$bJG9DFgctBh99QiQScWfc.WjeWxnbDnfj6gCJDxz9or8/Uk8wrEny',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      const isValidPasswordSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);

      const user = await authService.verifyUser(testLoginDto);

      expect(isValidPasswordSpy).toHaveBeenCalledWith(
        testLoginDto.password,
        mockUser.password,
      );
      expect(findOneBySpy).toHaveBeenCalledWith({
        username: testLoginDto.username,
      });
      expect(findOneBySpy).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUser);
    });

    test('사용자 아이디가 존재하지 않아 에러 발생', async () => {
      const testLoginDto: SignInUserDto = {
        username: 'id_does_not_exist',
        password: '1234',
      };

      const mockUser = null;

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      try {
        await authService.verifyUser(testLoginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('존재하지 않는 계정입니다.');
        expect(findOneBySpy).toHaveBeenCalledWith({
          username: testLoginDto.username,
        });
        expect(findOneBySpy).toHaveBeenCalledTimes(1);
      }
    });

    test('사용자 비밀번호가 일치하지 않아 에러 발생', async () => {
      const testLoginDto = {
        username: 'test',
        password: 'wrong_password',
      } as SignInUserDto;

      const mockUser = {
        id: 1,
        username: testLoginDto.username,
        password: 'encrypted_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findOneBySpy = jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue(mockUser);

      const isValidPasswordSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);

      try {
        await authService.verifyUser(testLoginDto);
      } catch (error) {
        expect(isValidPasswordSpy).toBe(false);
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('비밀번호가 일치하지 않습니다.');
        expect(findOneBySpy).toHaveBeenCalledWith({
          username: testLoginDto.username,
        });
        expect(findOneBySpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
