import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { MailerController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { AccommodationsModule } from '../accommodations/accommodations.module';

@Module({
  controllers: [MailerController],
  providers: [MailerService, ConfigService, BookingsService],
  imports: [TypeOrmModule.forFeature([Booking]), AccommodationsModule],
})
export class MailModule {}
