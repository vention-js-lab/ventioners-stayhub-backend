import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { MailerController } from './mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  controllers: [MailerController],
  providers: [MailerService, ConfigService],
  imports: [ConfigModule, BookingsModule],
  exports: [MailerService],
})
export class MailModule {}
