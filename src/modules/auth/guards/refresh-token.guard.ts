import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthConfig } from 'src/shared/configs';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(AuthConfig.RefreshTokenKey) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, _info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
