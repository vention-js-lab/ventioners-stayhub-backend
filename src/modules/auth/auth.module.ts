import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthTokenStrategy, RefreshTokenStrategy } from './strategies';
import { RedisModule } from 'src/redis/redis.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule, UsersModule, PassportModule, RedisModule, MailModule],
  providers: [AuthService, RefreshTokenStrategy, AuthTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
