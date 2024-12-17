import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { BookingsService } from '../bookings/bookings.service';
import dayjs from 'dayjs';
import { MailSendingException } from 'src/shared/exceptions';
import { Booking } from '../bookings/entities/booking.entity';

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
        text: text,
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
    const htmlContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
  <div style="background-color: #007bff; color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 20px;">Booking Status Update</h2>
  </div>
  <div style="padding: 15px; color: #333;">
    <p style="margin: 0;">Dear <strong>${user.firstName}</strong>,</p>
    <p style="margin: 0;">Your booking at <strong>${accommodation.name}</strong> has been updated. Here are the details:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 0px; padding-top: 0">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Accommodation</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${accommodation.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Location</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${accommodation.location}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Check-in</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkInDateStr}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Check-out</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkOutDateStr}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Total Price</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${totalPrice} USD</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Status</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: ${
          booking.status === 'CANCELLED' ? 'red' : 'brown'
        };">${status}</td>
      </tr>
    </table>
    <p style="margin: 10px 0;">For any queries, please feel free to <a href="mailto:support@stayhub.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
    <p style="margin: 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
  </div>
  <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
    <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
  </div>
</div>

  `;

    await this.sendEmail(subject, htmlContent, user.email);
  }

  async sendInvoiceMail(booking: Booking) {
    const { user, accommodation, totalPrice } = booking;
    const issueDate = dayjs().format('MMMM D, YYYY');
    const bookingId = booking.id;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
  <div style="background-color: #007bff; color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 20px;">Booking Invoice</h2>
  </div>
  <div style="padding: 15px;">
    <p style="margin: 0;">Dear <strong>${user.firstName}</strong>,</p>
    <p style="margin:  0;">Thank you for booking with Stayhub. Below are your invoice details:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 0px; padding-top: 0">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Booking ID</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${bookingId}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Accommodation</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${accommodation.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Issue Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${issueDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Total Payment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${totalPrice} USD</td>
      </tr>
    </table>
    <p style="margin: 10px 0;">For any assistance, please <a href="mailto:support@stayhub.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
    <p style="margin: 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
  </div>
  <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
    <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
  </div>
</div>

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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
  <div style="background-color: #007bff; color: white; text-align: center; padding: 20px;">
    <h2 style="margin: 0; font-size: 22px;">We Value Your Feedback</h2>
  </div>
  <div style="padding: 20px; color: #333;">
    <p style="margin: 0 0 10px;">Dear <strong>${user.firstName}</strong>,</p>
    <p style="margin: 0 0 20px;">Thank you for staying at <strong>${accommodation.name}</strong>. We hope you had a fantastic experience!</p>
    <p style="margin: 0 0 20px;">We would greatly appreciate it if you could take a moment to review your stay. Your feedback helps us improve!</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${reviewPageUrl}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 14px; border-radius: 5px;">Leave a Review</a>
    </div>
    <p style="margin: 0;">Thank you for your time and support.</p>
    <p style="margin: 20px 0 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
  </div>
  <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
    <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
  </div>
</div>

  `;

    await this.sendEmail(subject, htmlContent, user.email);
  }
}
