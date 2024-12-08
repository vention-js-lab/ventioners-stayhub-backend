import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { CreatePaymentDto, CreateStripeCheckoutDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createStripeCheckout(createStripeCheckoutDto: CreateStripeCheckoutDto) {
    return await this.stripeService.checkout(createStripeCheckoutDto);
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      status: createPaymentDto.status,
      booking: createPaymentDto.booking,
    });

    return await this.paymentRepository.save(payment);
  }
}
