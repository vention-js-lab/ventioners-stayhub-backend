import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { BookingsService } from '../bookings/bookings.service';
import dayjs from 'dayjs';
import { MailSendingException } from 'src/shared/exceptions';
import { Booking } from '../bookings/entities/booking.entity';
import { generateEmailVerificationTemplate } from './templates';
import { VERIFICATION_LINK_EXPIRE_TIME } from 'src/shared/constants';

@Injectable()
export class MailerService {
  private readonly transport: ReturnType<typeof createTransport>;
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
  }

  private formatBookingDate(date: Date): string {
    return dayjs(date).locale('uz').format('dddd, MMMM D, YYYY');
  }

  public async sendEmail(subject: string, text: string, recipient: string) {
    try {
      await this.transport.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: recipient,
        subject: subject,
        html: text,
      });
    } catch (error) {
      throw new MailSendingException('Error sending email');
    }
  }

  async sendStatusMail(booking: Booking) {
    const {
      user,
      accommodation,
      checkInDate,
      checkOutDate,
      totalPrice,
      status,
    } = booking;

    const checkInDateStr = this.formatBookingDate(checkInDate);
    const checkOutDateStr = this.formatBookingDate(checkOutDate);

    const subject = `Booking Status Update for ${accommodation.name}`;
    const text = `
      Hello ${user.firstName},

      Your booking at ${accommodation.name} has been updated.

      Booking Details:
      Accommodation: ${accommodation.name}
      Location: ${accommodation.location}
      Check-in Date: ${checkInDateStr}
      Check-out Date: ${checkOutDateStr}
      Total Price: ${totalPrice} USD
      Status: ${status}

      If you have any questions, feel free to contact us.

      Best regards,
      Stayhub Team
    `;

    await this.sendEmail(subject, text, user.email);
  }

  async sendInvoiceMail(booking: Booking) {
    const { user, accommodation, totalPrice } = booking;

    const issueDate = dayjs().format('MMMM D, YYYY');
    const bookingId = booking.id;

    const htmlContent = `
      <h2>Invoice</h2>
      <p style="margin: 0">Hello ${user.firstName},</p>
      <p style="margin: 0">You have successfully made a payment for your booking at ${accommodation.name}. Please find your invoice details below:</p>
      <p style="margin: 0"><strong>Booking ID:</strong> ${bookingId}</p>
      <p style="margin: 0"><strong>Property:</strong> ${accommodation.name}</p>
      <p style="margin: 0"><strong>Status:</strong> <span style="display: inline-block; padding: 5px 10px; background-color: green; color: white; border-radius: 10px;">${booking.status}</span></p>
      <p style="margin: 0"><strong>Type:</strong> Booking</p>
      <p style="margin: 0"><strong>Issue Date:</strong> ${issueDate}</p>
      <p style="margin: 0"><strong>Total Payment:</strong> ${totalPrice} USD</p>
      <p style="margin: 0">If you have any questions, feel free to contact us.</p>
      <p style="margin: 0">Best regards,<br>Stayhub Team</p>
    `;

    await this.sendEmail(
      `Booking Invoice for ${accommodation.name}`,
      htmlContent,
      user.email,
    );
  }

  async sendReviewMail(booking: Booking) {
    const { user, accommodation } = booking;

    const subject = `Review Your Stay at ${accommodation.name}`;
    const reviewPageUrl = `${this.configService.get('CLIENT_URL')}/property/${booking.accommodation.id}`;

    const htmlContent = `
    <p style="margin: 0">Hello ${user.firstName},</p>
    <p style="margin: 0">Your stay at <strong>${accommodation.name}</strong> has ended. We hope you had a great time!</p>
    <p style="margin: 0">Please take a moment to review your stay and help us improve our services.</p>
    <p style="margin: 0">
      <a href="${reviewPageUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Leave a Review</a>
    </p>
    <p >Best regards,<br>Stayhub Team</p>
  `;

    await this.sendEmail(subject, htmlContent, user.email);
  }

  private createVerificationEmail = (
    username: string,
    token: string,
    email: string,
    expirationMinutes: number,
  ) => {
    const verificationLink = `${this.configService.get('CLIENT_URL')}/verify-email?email=${email}&token=${token}`;

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
