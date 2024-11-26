import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { AuthConfig } from '../configs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthTokenGuard extends PAuthGuard(AuthConfig.AuthTokenKey) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, _info: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        'Sign in required to perform this action',
      );
    }

    return user;
  }
}
