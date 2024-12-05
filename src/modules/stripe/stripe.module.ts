import { Global, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { AccommodationsModule } from '../accommodations/accommodations.module';

@Global()
@Module({
  imports: [ConfigModule, BookingsModule, AccommodationsModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
