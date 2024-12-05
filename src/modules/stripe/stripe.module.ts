import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { AccommodationsModule } from '../accommodations/accommodations.module';
import { RawBodyMiddleware } from '../../shared/middlewares';

@Module({
  imports: [ConfigModule, BookingsModule, AccommodationsModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes('stripe/webhook');
  }
}
