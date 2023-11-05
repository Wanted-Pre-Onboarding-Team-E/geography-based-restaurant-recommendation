import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signUpUser.dto';
import { SignInUserDto } from './dto/signInUser.dto';
import { SuccessType } from '../../enum/successType.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpUserDto: SignUpUserDto, @Res() res: Response) {
    // 중복된 사용자 존재 여부 확인
    await this.authService.checkUserExists(signUpUserDto.username);

    // 비밀번호 유효성 확인
    await this.authService.checkPasswordValidate(
      signUpUserDto.password,
      signUpUserDto.confirmPassword,
    );

    // 사용자 생성
    const user = await this.authService.createUser(signUpUserDto);

    return res.send({
      message: SuccessType.USER_SIGN_UP,
      data: user.username,
    });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInUserDto: SignInUserDto, @Res() res: Response) {
    // 동록된 사용자 확인
    const verifiedUser = await this.authService.verifyUser(signInUserDto);

    // JWT 발급
    const payload = { id: verifiedUser.id, username: verifiedUser.username };
    const accessToken = await this.authService.getAccessToken(payload);

    // Set-Cookie 헤더로 JWT 토큰 & 응답 body로 사용자 정보 반환
    return res.cookie('accessToken', accessToken, { httpOnly: true }).json({
      message: SuccessType.USER_SIGN_IN,
      data: payload,
    });
  }
}
