import { GoogleStrategy } from './strategies/google.strategy';
import { Module } from '@nestjs/common';
import { OAppController } from './oAuth.controller';
import { OAuthService } from './oAuth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OAppController],
  providers: [OAuthService, GoogleStrategy],
})
export class OAuthModule {}
