import {
  Controller,
  HttpCode,
  Post,
  Headers,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature || !rawBody) {
      throw new BadRequestException('Missing signature or raw body');
    }

    return await this.stripeService.handleWebhook(rawBody, signature);
  }
}
