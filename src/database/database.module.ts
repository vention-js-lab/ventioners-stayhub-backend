import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Accommodation, Image } from 'src/modules/accommodations/entities';
import { Wishlist } from '@modules';
import { Amenity } from 'src/modules/amenities/entities';
import { AccommodationCategory } from 'src/modules/categories/entities';
import { User } from 'src/modules/users/entities/user.entity';
import { Booking } from 'src/modules/bookings/entities/booking.entity';
import { Review } from 'src/modules/reviews/entities';
import { isProd } from 'src/shared/helpers';

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
        entities: [
          User,
          Accommodation,
          Amenity,
          AccommodationCategory,
          Wishlist,
          Image,
          Booking,
          Review,
        ],
        migrations: [`./migrations/**/*{.ts,.js}`],
        ssl: isProd(configService.get('NODE_ENV')),
        ...(isProd(configService.get('NODE_ENV')) && {
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
