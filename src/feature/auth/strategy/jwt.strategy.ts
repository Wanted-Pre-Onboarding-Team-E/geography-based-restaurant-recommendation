import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserLib } from '../../user/user.lib';
import { FailType } from '../../../enum/failType.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userLib: UserLib,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number; username: string }) {
    const user = await this.userLib.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException(FailType.SIGNIN_USERNAME_NOT_EXIST);
    }

    // req.user에 사용자 정보를 담음
    return {
      id: user.id,
      username: user.username,
    };
  }
}
