import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Accommodation } from 'src/modules/accommodations/entities';
import { Wishlist } from '@modules';
import { Amenity } from 'src/modules/amenities/entities';
import { AccommodationCategory } from 'src/modules/categories/entities';
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
        entities: [
          User,
          Accommodation,
          Amenity,
          AccommodationCategory,
          Wishlist,
        ],
        synchronize: true,
        migrations: [`./migrations/**/*{.ts,.js}`],
        ssl: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
