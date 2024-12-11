import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport } from 'nodemailer';
import { Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class MailerService {
  private readonly transport: ReturnType<typeof createTransport>;
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
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
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private async sendEmail(subject: string, text: string, recipient: string) {
    try {
      await this.transport.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: recipient,
        subject: subject,
        text: text,
      });
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      throw new NotFoundException('Error sending email');
    }
  }

  private async getBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['accommodation', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async sendStatusMail(id: string) {
    const booking = await this.getBooking(id);
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

  async sendInvoiceMail(id: string) {
    const booking = await this.getBooking(id);
    const { user, accommodation, totalPrice } = booking;

    const issueDate = new Date().toLocaleDateString('en-US');
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

  async sendReviewMail(id: string) {
    const booking = await this.getBooking(id);
    const { user, accommodation } = booking;

    const subject = `Review Your Stay at ${accommodation.name}`;

    const reviewPageUrl = `https://stayhub.live/booking/${id}`;

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
}
