import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OAuthModule } from './modules';
import { AccommodationsModule } from './modules/accommodations/accommodations.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';

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
    AccommodationsModule,
    CategoriesModule,
    AmenitiesModule,
  ],
})
export class AppModule {}
