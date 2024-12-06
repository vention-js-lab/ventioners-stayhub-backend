import { PaymentStatus } from '../constants';
import { Booking } from '../../bookings/entities/booking.entity';

export class CreatePaymentDto {
  amount: number;
  booking: Booking;
  status: PaymentStatus;
}
