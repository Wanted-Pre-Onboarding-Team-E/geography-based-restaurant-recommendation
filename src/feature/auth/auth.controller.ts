import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // FIXME: 엔드포인트 연결 여부를 확인하기 위해 임시로 작성했습니다. 함수명은 원하시는대로 수정해주세요~!
  @Post('sign-up')
  signUp() {
    return 'POST /auth/sign-up';
  }

  @Post('sign-in')
  signIn() {
    return 'POST /auth/sign-in';
  }
}
