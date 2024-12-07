import { GoogleStrategy } from './strategies/google.strategy';
import { Module } from '@nestjs/common';
import { OAuthController } from './oAuth.controller';
import { OAuthService } from './oAuth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UsersModule, JwtModule, RedisModule],
  controllers: [OAuthController],
  providers: [OAuthService, GoogleStrategy],
})
export class OAuthModule {}
