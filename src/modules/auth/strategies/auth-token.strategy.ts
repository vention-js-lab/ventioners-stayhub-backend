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

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(
  Strategy,
  AuthConfig.AuthTokenKey,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['accessToken'],
      ]),
      secretOrKey: configService.get<string>('AUTH_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload, done: VerifiedCallback) {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken || !payload) {
      req.res.clearCookie('accessToken');
      return done(new UnauthorizedException('Invalid access token'), false);
    }

    const user = await this.usersRepository.findOne({
      where: { email: payload.userEmail },
    });

    if (!user) {
      return done(new BadRequestException('User does not exist'), false);
    }

    return done(null, payload);
  }
}
