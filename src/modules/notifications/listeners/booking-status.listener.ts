import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvent } from '../events/notification.event';
import { MailerService } from 'src/modules/mail/mail.service';

@Injectable()
export class BookingStatusListener {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('booking.status.changed')
  async handleBookingStatusChange(event: NotificationEvent) {
    this.mailerService.sendStatusMail(event.bookingId);
  }

  @OnEvent('booking.status.confirmed')
  async handleBookingStatusConfirmed(event: NotificationEvent) {
    this.mailerService.sendInvoiceMail(event.bookingId);
  }

  @OnEvent('booking.status.review')
  async handleBookingStatusCancelled(event: NotificationEvent) {
    this.mailerService.sendReviewMail(event.bookingId);
  }
}
