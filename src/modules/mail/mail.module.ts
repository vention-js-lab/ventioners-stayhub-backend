import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  controllers: [],
  providers: [MailerService, ConfigService],
  imports: [ConfigModule, BookingsModule],
  exports: [MailerService],
})
export class MailModule {}
