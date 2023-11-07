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

  async getUserInfo(id: number) {
    const user = await this.userLib.getUserById(id);
    if (!user) {
      throw new UnauthorizedException(FailType.USERNAME_NOT_EXIST);
    }

    return user;
  }

  async updateUserRecommendation(id: number, isRecommended: boolean) {
    const user = await this.userLib.updateUserRecommendation(id, isRecommended);
    if (!user.affected) {
      throw new BadRequestException(FailType.USER_UPDATE_FAILED);
    }
  }

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
