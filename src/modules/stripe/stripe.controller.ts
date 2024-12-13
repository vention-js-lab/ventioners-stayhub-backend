import {
  Controller,
  HttpCode,
  Post,
  Headers,
  BadRequestException,
  Body,
  Logger,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  private logger = new Logger(StripeController.name, { timestamp: true });

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
