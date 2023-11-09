import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLib } from './user.lib';
import { FailType } from '../../enum/failType.enum';
import { UpdateUserLocationDto } from './dto/updateUserLocation.dto';

@Injectable()
export class UserService {
  constructor(private readonly userLib: UserLib) {}

  /** 사용자 정보 조회
   * @Param id 로그인한 사용자 생성 ID */
  async getUserInfo(id: number) {
    const user = await this.userLib.getUserById(id);
    if (!user) {
      throw new UnauthorizedException(FailType.USERNAME_NOT_EXIST);
    }

    return user;
  }

  /** 사용자 점심 추천 여부 업데이트
   * @Param id 로그인한 사용자 생성 ID
   * @Param isRecommended 점심 추천 여부 */
  async updateUserRecommendation(id: number, isRecommended: boolean) {
    const user = await this.userLib.updateUserRecommendation(id, isRecommended);
    if (!user.affected) {
      throw new BadRequestException(FailType.USER_UPDATE_FAILED);
    }
  }

  /** 사용자 위치 업데이트
   * @Param id 로그인한 사용자 생성 ID
   * @Param updateUserLocationDto 사용자 위치 정보 */
  async updateUserLocation(
    id: number,
    updateUserLocationDto: UpdateUserLocationDto,
  ) {
    const user = await this.userLib.updateUserLocation(
      id,
      updateUserLocationDto,
    );
    if (!user.affected) {
      throw new BadRequestException(FailType.USER_UPDATE_FAILED);
    }
  }
}
