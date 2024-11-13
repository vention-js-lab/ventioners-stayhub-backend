import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Accommodation,
  AccommodationCategory,
  Amenity,
} from 'src/modules/accommodations/entities';
import { User } from 'src/modules/users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Accommodation, Amenity],
        migrations: [`./migrations/**/*{.ts,.js}`],
        ssl: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Accommodation,
      Amenity,
      AccommodationCategory,
    ]), // Add your ennities here to be able to use them in your services
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
