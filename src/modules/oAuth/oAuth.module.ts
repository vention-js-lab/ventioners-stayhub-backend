import { GoogleStrategy } from './strategies/google.strategy';
import { Module } from '@nestjs/common';
import { AppController } from './oAuth.controller';
import { OAuthService } from './oAuth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  controllers: [AppController],
  providers: [OAuthService, GoogleStrategy],
})
export class OAuthModule {}
