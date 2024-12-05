import {
  Controller,
  HttpCode,
  Post,
  Req,
  Headers,
  RawBodyRequest,
  Body,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { CreateCheckoutDto } from './dto';
import { AuthTokenGuard } from '../../shared/guards';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  @UseGuards(AuthTokenGuard)
  @HttpCode(200)
  async checkout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return await this.stripeService.checkout(createCheckoutDto);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.stripeService.handleWebhook(req.rawBody, signature);
  }
}
