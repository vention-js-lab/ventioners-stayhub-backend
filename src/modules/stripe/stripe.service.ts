import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/constants';
import { AccommodationsService } from '../accommodations/accommodations.service';
import { Accommodation } from '@modules';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateCheckoutDto } from './dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly baseUrl = this.configService.get('ALLOWED_ORIGINS');

  constructor(
    private readonly configService: ConfigService,
    private readonly bookingsService: BookingsService,
    private readonly accommodationsService: AccommodationsService,
  ) {
    const apiKey = this.configService.get('STRIPE_SECRET_KEY');
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
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: booking.id,
        userId: booking.user.id,
      },
      // For now we redirect to the same page with query params
      success_url: `${this.baseUrl}/property/${accommodation.id}?success=true&bookingId=${booking.id}`,
      cancel_url: `${this.baseUrl}/property/${accommodation.id}?success=false&bookingId=${booking.id}`,
    });

    return { checkoutSessionUrl: session.url };
  }

  async handleWebhook(body: Buffer, signature: string) {
    const event = this.constructEvent(body, signature);
    if (!event) return { received: false };

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSuccess = event.data.object;
        return await this.handlePaymentIntent(paymentIntentSuccess, 'success');
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object;
        return await this.handlePaymentIntent(paymentIntentFailed, 'failed');
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
      throw new BadRequestException(`Booking with id ${bookingId} not found`);
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
      console.log(error);
      return false;
    }
  }
}
