import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { MailerController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { Accommodation } from '../accommodations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [MailerController],
  providers: [MailerService, ConfigService],
  imports: [TypeOrmModule.forFeature([Accommodation, Booking, User])],
})
export class MailModule {}
