import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OAuthModule } from './modules';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OAuthModule,
  ],
})
export class AppModule {}
