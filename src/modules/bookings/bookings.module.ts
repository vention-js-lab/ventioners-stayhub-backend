import { Module, forwardRef } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { AccommodationsModule } from '../accommodations/accommodations.module';
import { NotificationModule } from '../notifications/notificaton.module';

@Module({
  imports: [
    AccommodationsModule,
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => NotificationModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
