import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserLib } from '../../user/user.lib';

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
      throw new UnauthorizedException('사용자가 존재하지 않습니다.');
    }

    // req.user에 사용자 정보를 담음
    return {
      id: user.id,
      username: user.username,
    };
  }
}
