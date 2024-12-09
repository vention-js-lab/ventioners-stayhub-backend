import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from '../../shared/guards';
import { CreateStripeCheckoutDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stripe-checkout')
  @UseGuards(AuthTokenGuard)
  async checkout(@Body() createCheckoutDto: CreateStripeCheckoutDto) {
    const checkoutSessionUrl =
      await this.paymentsService.createStripeCheckout(createCheckoutDto);
    return { data: checkoutSessionUrl };
  }
}
