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
import { SignUpUserDto } from './dto/signupUser.dto';
import { SignInUserDto } from './dto/signinUser.dto';
import { SuccessType } from '../../enum/successType.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signupUserDto: SignUpUserDto, @Res() res: Response) {
    // 중복된 사용자 존재 여부 확인
    const creatableUser = await this.authService.checkUserExists(
      signupUserDto.username,
    );
    // 비밀번호 유효성 확인
    const passwordValid = await this.authService.checkPasswordValidate(
      signupUserDto.password,
      signupUserDto.confirmPassword,
    );
    // 사용자 생성
    await this.authService.createUser(signupUserDto);

    return res.send({
      message: SuccessType.USER_SIGNUP,
      data: { creatableUser, passwordValid },
    });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signinUserDto: SignInUserDto, @Res() res: Response) {
    // 동록된 사용자 확인
    const verifiedUser = await this.authService.verifyUser(signinUserDto);

    // JWT 발급
    const payload = { id: verifiedUser.id, username: verifiedUser.username };
    const accessToken = await this.authService.getAccessToken(payload);

    // Set-Cookie 헤더로 JWT 토큰 & 응답 body로 사용자 정보 반환
    return res.cookie('accessToken', accessToken, { httpOnly: true }).json({
      message: SuccessType.USER_SIGNIN,
      data: payload,
    });
  }
}
