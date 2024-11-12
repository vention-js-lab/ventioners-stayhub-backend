import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { AuthConfig } from '../configs';

export class AuthTokenGuard extends PAuthGuard(AuthConfig.AuthTokenKey) {}
