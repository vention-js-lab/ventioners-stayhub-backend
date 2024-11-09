import { GoogleStrategy } from './strategies/google.strategy';
import { Module } from '@nestjs/common';
import { OAppController } from './oAuth.controller';
import { OAuthService } from './oAuth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OAppController],
  providers: [OAuthService, GoogleStrategy],
})
export class OAuthModule {}
