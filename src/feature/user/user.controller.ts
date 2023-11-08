import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SuccessType } from '../../enum/successType.enum';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { UpdateUserRecommendationDto } from './dto/updateUserRecommendation.dto';
import { UpdateUserLocationDto } from './dto/updateUserLocation.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 사용자 정보 확인
   * @Req req 현재 로그인 정보 */
  @Get('/me')
  async getUserInfo(@Req() req: any) {
    const { id, username, isRecommended, latitude, longitude } =
      await this.userService.getUserInfo(req.user.id);
    return {
      message: SuccessType.USER_GET,
      data: { id, username, isRecommended, latitude, longitude },
    };
  }

  /** 사용자 점심 추천 여부 업데이트
   * @Body updateUserDto 업데이트 정보
   * @Req req 현재 로그인 정보 */
  @Patch('/recommendation')
  async patchUsers(
    @Body() updateUserDto: UpdateUserRecommendationDto,
    @Req() req: any,
  ) {
    await this.userService.updateUserRecommendation(
      req.user.id,
      updateUserDto.isRecommended,
    );
    return {
      message: SuccessType.USER_UPDATE,
      data: {
        id: req.user.id,
        isRecommended: updateUserDto.isRecommended,
      },
    };
  }

  /** 사용자 위치 업데이트
   * @Body updateUserLocationDto 업데이트 위치 정보
   * @Req req 현재 로그인 정보 */
  @Patch('/location')
  async patchUsersLocation(
    @Body() updateUserLocationDto: UpdateUserLocationDto,
    @Req() req: any,
  ) {
    await this.userService.updateUserLocation(
      req.user.id,
      updateUserLocationDto,
    );

    return {
      message: SuccessType.USER_UPDATE,
      data: {
        id: req.user.id,
        ...updateUserLocationDto,
      },
    };
  }
}
