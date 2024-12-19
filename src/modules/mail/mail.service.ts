import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { BookingsService } from '../bookings/bookings.service';
import { MailSendingException } from 'src/shared/exceptions';
import { Booking } from '../bookings/entities/booking.entity';
import {
  generateBookingStatusMail,
  generateEmailVerificationTemplate,
  generatePaymentInvoiceMail,
  generatePaymentReviewTemplate,
} from './templates';
import { VERIFICATION_LINK_EXPIRE_TIME } from 'src/shared/constants';

@Injectable()
export class MailerService {
  private readonly transport: ReturnType<typeof createTransport>;
  private readonly clientURL: string;
  private readonly logger = new Logger(MailerService.name, { timestamp: true });
  constructor(
    private readonly configService: ConfigService,
    @Inject(BookingsService) private readonly bookingService: BookingsService,
  ) {
    this.transport = createTransport({
      host: this.configService.get('BREVO_SMTP_SERVER'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('BREVO_LOGIN'),
        pass: this.configService.get('BREVO_SMTP_KEY'),
      },
    });
    this.clientURL = this.configService.get('CLIENT_URL');
  }

  async sendEmail(subject: string, text: string, recipient: string) {
    try {
      const info = await this.transport.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: recipient,
        subject: subject,
        html: text,
      });

      this.logger.log(`Email sent to ${recipient}: ${info.messageId}`);
    } catch (error) {
      throw new MailSendingException('Error sending email');
    }
  }

  async sendStatusMail(booking: Booking) {
    const subject = `Booking Status Update for ${booking.accommodation.name}`;
    const mailBody = generateBookingStatusMail(booking);

    await this.sendEmail(subject, mailBody, booking.user.email);
  }

  async sendInvoiceMail(booking: Booking) {
    const subject = `Booking Invoice for ${booking.accommodation.name}`;
    const mailBody = generatePaymentInvoiceMail(booking);

    await this.sendEmail(subject, mailBody, booking.user.email);
  }

  async sendReviewMail(booking: Booking) {
    const subject = `Review Your Stay at ${booking.accommodation.name}`;
    const reviewPageUrl = `${this.clientURL}/property/${booking.accommodation.id}`;
    const mailBody = generatePaymentReviewTemplate(booking, reviewPageUrl);

    await this.sendEmail(subject, mailBody, booking.user.email);
  }

  private createVerificationEmail = (
    username: string,
    token: string,
    email: string,
    expirationMinutes: number,
  ) => {
    const verificationLink = `${this.clientURL}/verify-email?email=${email}&token=${token}`;

    return generateEmailVerificationTemplate({
      username,
      verificationLink,
      expirationMinutes,
    });
  };

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string,
  ) {
    const mailBody = this.createVerificationEmail(
      firstName,
      verificationToken,
      email,
      VERIFICATION_LINK_EXPIRE_TIME / 60,
    );

    await this.sendEmail('Verify Your Email', mailBody, email);
  }
}
