import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.types';
import { AuthConfig } from 'src/shared/configs';
import { UsersRepository } from 'src/modules/users/users.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthConfig.RefreshTokenKey,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['refreshToken'],
      ]),
      secretOrKey: configService.get<string>('AUTH_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload, done: VerifiedCallback) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken || !payload) {
      req.res.clearCookie('refreshToken');
      return done(new UnauthorizedException('Invalid refresh token'), false);
    }

    const isBlacklisted =
      await this.redisService.isTokenBlacklisted(refreshToken);

    if (isBlacklisted) {
      req.res.clearCookie('refreshToken');
      return done(new UnauthorizedException('Token has been revoked'), false);
    }

    const user = await this.usersRepository.findOne({
      where: { email: payload.userEmail },
    });

    if (!user) {
      return done(new BadRequestException('User does not exist'), false);
    }

    return done(null, user);
  }
}
