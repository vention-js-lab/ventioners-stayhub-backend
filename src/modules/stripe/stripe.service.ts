import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/constants';
import { AccommodationsService } from '../accommodations/accommodations.service';
import { Booking } from '../bookings/entities/booking.entity';
import { generateAfterPaymentUrl } from '../../shared/helpers';
import { convertToCent } from '../../shared/helpers';
import { SessionMetadata } from './types';
import { CreateStripeCheckoutDto } from '../payments/dto';
import { PaymentsService } from '../payments/payments.service';
import { PaymentStatus } from '../payments/constants';
import { Accommodation } from '../accommodations';

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
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {
    const apiKey = this.configService.get('STRIPE_SECRET_KEY');
    this.clientURL = this.configService.get('CLIENT_URL');
    this.webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(apiKey);
  }

  async checkout(dto: CreateStripeCheckoutDto) {
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
      success_url: this.generatePaymentUrl(true),
      cancel_url: this.generatePaymentUrl(false),
    });
    if (!session.url) {
      throw new InternalServerErrorException(
        'Failed to create checkout session',
      );
    }

    return session.url;
  }

  async handleWebhook(rawBody: string | Buffer, signature: string) {
    try {
      const event = this.verifyEvent(rawBody, signature);
      return await this.processStripeEvent(event);
    } catch (error) {
      this.logger.error(
        `Webhook handling error: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Webhook processing failed');
    }
  }

  private async processStripeEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handleCompletedSession(event);

      case 'checkout.session.expired':
        return this.handleExpiredSession(event);

      case 'checkout.session.async_payment_failed':
        return this.handleSessionOutcome(event, PaymentStatus.FAILED);

      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
        return { received: false };
    }
  }

  private async handleCompletedSession(event: Stripe.Event) {
    return this.handleSessionOutcome(event, PaymentStatus.APPROVED);
  }

  private async handleExpiredSession(event: Stripe.Event) {
    return this.handleSessionOutcome(event, PaymentStatus.FAILED);
  }

  private async handleSessionOutcome(
    event: Stripe.Event,
    paymentStatus: PaymentStatus,
  ) {
    const session = await this.getSession(
      (event.data.object as Stripe.Checkout.Session).id,
    );

    if (!session) {
      throw new BadRequestException('Invalid session');
    }

    return this.handlePaymentIntent(session, paymentStatus);
  }

  async handlePaymentIntent(
    session: Stripe.Checkout.Session,
    paymentStatus: PaymentStatus,
  ) {
    const { bookingId, userId } = session.metadata;

    const booking = await this.bookingsService.getBooking(userId, bookingId);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Booking with id ${bookingId} is not in pending state`,
      );
    }

    const bookingStatus =
      paymentStatus === PaymentStatus.APPROVED
        ? BookingStatus.CONFIRMED
        : BookingStatus.CANCELLED;

    await Promise.all([
      this.paymentsService.createPayment({
        amount: convertToCent(booking.totalPrice),
        booking,
        status: paymentStatus,
      }),
      this.bookingsService.updateStatus(
        { status: bookingStatus },
        userId,
        bookingId,
      ),
    ]);

    return { received: true };
  }

  private verifyEvent(body: string | Buffer, signature: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret,
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  private async getSession(sessionId: string) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      this.logger.error('Failed to get session: ', error);
      return false;
    }
  }

  private generatePaymentUrl(success: boolean) {
    return generateAfterPaymentUrl({
      clientURL: this.clientURL,
      success,
    });
  }
}
