import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OAuthModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    AuthModule,
    OAuthModule,
  ],
})
export class AppModule {}
