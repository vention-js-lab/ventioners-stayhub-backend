import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Accommodation } from '../accommodations';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UsersModule } from '../users/users.module';
import { AccommodationsModule } from '../accommodations/accommodations.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Accommodation, User, Booking]),
    UsersModule,
    AccommodationsModule,
    BookingsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
