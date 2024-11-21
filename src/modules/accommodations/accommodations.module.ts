import { Module } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accommodation, Wishlist } from './entities';
import { User } from '../users/entities/user.entity';
import { CategoriesModule } from '../categories/categories.module';
import { AmenitiesModule } from '../amenities/amenities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accommodation, Wishlist, User]),
    AmenitiesModule,
    CategoriesModule,
  ],
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
})
export class AccommodationsModule {}
