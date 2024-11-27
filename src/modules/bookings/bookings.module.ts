import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Accommodation } from '../accommodations';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Accommodation])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
