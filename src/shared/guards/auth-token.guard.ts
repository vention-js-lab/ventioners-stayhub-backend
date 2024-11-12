import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { AuthConfig } from '../configs';

/**
 * Decorate the endpoint inside the
 * controller to protect the route
 *
 * @example
 * @UseGuards(AuthTokenGuard)
 *
 **/
export class AuthTokenGuard extends PAuthGuard(AuthConfig.AuthTokenKey) {}
