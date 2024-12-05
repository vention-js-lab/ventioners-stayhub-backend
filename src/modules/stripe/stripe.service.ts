import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/constants';
import { AccommodationsService } from '../accommodations/accommodations.service';
import { Accommodation } from '@modules';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateCheckoutDto } from './dto';
import { generateAfterPaymentUrl } from '../../shared/helpers/generate-after-payment-url';
import { convertToCent } from '../../shared/helpers/convert-to-cent';
import { SessionMetadata } from './types';

@Injectable()
export class StripeService {
  private logger = new Logger(StripeService.name, { timestamp: true });
  private stripe: Stripe;
  private readonly clientURL: string;
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly bookingsService: BookingsService,
    private readonly accommodationsService: AccommodationsService,
  ) {
    const apiKey = this.configService.get('STRIPE_SECRET_KEY');
    this.clientURL = this.configService.get('CLIENT_URL');
    this.webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(apiKey);
  }

  async checkout(dto: CreateCheckoutDto) {
    const accommodation = await this.accommodationsService.getAccommodationById(
      dto.accommodationId,
    );
    const booking = await this.bookingsService.getBookingById(dto.bookingId);

    return await this.createCheckoutSession(accommodation, booking);
  }

  private async createCheckoutSession(
    accommodation: Accommodation,
    booking: Booking,
  ) {
    const accommodationImage = accommodation.images
      .filter((image) => image.order === 1)
      .map((image) => image.url);

    const sessionMetadata: SessionMetadata = {
      bookingId: booking.id,
      userId: booking.user.id,
    };
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: accommodation.name,
              description: accommodation.description,
              images: accommodationImage,
            },
            unit_amount: convertToCent(booking.totalPrice),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: sessionMetadata,
      // For now we redirect to the same page with query params
      success_url: generateAfterPaymentUrl({
        accommodationId: accommodation.id,
        bookingId: booking.id,
        clientURL: this.clientURL,
        success: true,
      }),
      cancel_url: generateAfterPaymentUrl({
        accommodationId: accommodation.id,
        bookingId: booking.id,
        clientURL: this.clientURL,
        success: false,
      }),
    });

    return { checkoutSessionUrl: session.url };
  }

  async handleWebhook(body: Buffer, signature: string) {
    if (
      !this.stripe.webhooks.signature.verifyHeader(
        JSON.stringify(body),
        signature,
        this.webhookSecret,
      )
    ) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = this.constructEvent(body, signature);
    if (!event) return { received: false };

    switch (event.type) {
      case 'payment_intent.succeeded':
        return await this.handlePaymentIntent(event.data.object, 'success');
      case 'payment_intent.payment_failed':
        return await this.handlePaymentIntent(event.data.object, 'failed');
      default:
        throw new BadRequestException(`Unhandled event type ${event.type}`);
    }
  }

  async handlePaymentIntent(
    paymentIntent: Stripe.PaymentIntent,
    paymentStatus: 'success' | 'failed',
  ) {
    const metadata = paymentIntent.metadata;
    const bookingId = metadata.bookingId;
    const userId = metadata.userId;

    const booking = await this.bookingsService.getBooking(userId, bookingId);

    if (!booking) {
      throw new BadRequestException(
        `Booking with id ${bookingId} does not exist`,
      );
    }

    if (booking.user.id !== userId) {
      throw new BadRequestException(
        `Booking with id ${bookingId} does not belong to user with id ${userId}`,
      );
    }

    if (booking.status != 'PENDING') {
      throw new BadRequestException(
        `Booking with id ${bookingId} is not in pending state`,
      );
    }

    await this.bookingsService.updateStatus(
      {
        status:
          paymentStatus === 'success'
            ? BookingStatus.CONFIRMED
            : BookingStatus.CANCELLED,
      },
      userId,
      bookingId,
    );

    return { received: true };
  }

  private constructEvent(body: Buffer, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret,
      );
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
