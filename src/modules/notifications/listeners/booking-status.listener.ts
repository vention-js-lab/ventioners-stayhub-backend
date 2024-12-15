import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvent } from '../events/notification.event';
import { MailerService } from 'src/modules/mail/mail.service';

@Injectable()
export class BookingStatusListener {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('booking.status.changed')
  async handleBookingStatusChange(event: NotificationEvent) {
    await this.mailerService.sendStatusMail(event.booking);
  }

  @OnEvent('booking.status.confirmed')
  async handleBookingStatusConfirmed(event: NotificationEvent) {
    await this.mailerService.sendInvoiceMail(event.booking);
  }

  @OnEvent('booking.status.review')
  async handleBookingStatusCancelled(event: NotificationEvent) {
    await this.mailerService.sendReviewMail(event.booking);
  }
}
