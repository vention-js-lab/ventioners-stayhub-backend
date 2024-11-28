import { Module } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accommodation, Wishlist, Image } from './entities';
import { User } from '../users/entities/user.entity';
import { CategoriesModule } from '../categories/categories.module';
import { AmenitiesModule } from '../amenities/amenities.module';
import { Amenity } from '../amenities/entities';
import { AccommodationCategory } from '../categories/entities';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Accommodation,
      Wishlist,
      User,
      Amenity,
      AccommodationCategory,
      Image,
    ]),
    AmenitiesModule,
    CategoriesModule,
    MinioModule,
  ],
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
  exports: [AccommodationsService],
})
export class AccommodationsModule {}
