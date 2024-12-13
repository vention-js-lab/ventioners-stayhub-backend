import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BookingStatusListener } from './listeners/booking-status.listener';
import { MailerService } from '../mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [ConfigModule, forwardRef(() => BookingsModule)],
  controllers: [],
  providers: [NotificationService, BookingStatusListener, MailerService],
  exports: [NotificationService],
})
export class NotificationModule {}
