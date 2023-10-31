import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // FIXME: 엔드포인트 연결 여부를 확인하기 위해 임시로 작성했습니다. 함수명은 원하시는대로 수정해주세요~!
  @Get('me')
  getMyInfo() {
    return 'GET /users/me';
  }

  @Patch('/')
  patchUsers() {
    return 'PATCH /users';
  }

  @Patch('/location')
  patchUsersLocation() {
    return 'PATCH /users/location';
  }
}
