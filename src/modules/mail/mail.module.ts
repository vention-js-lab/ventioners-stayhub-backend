import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { MailerController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  controllers: [MailerController],
  providers: [MailerService, ConfigService],
  imports: [TypeOrmModule.forFeature([Booking])],
})
export class MailModule {}
