import { Booking } from 'src/modules/bookings/entities/booking.entity';

export class NotificationEvent<T = Booking> {
  constructor(
    public readonly type: string,
    public readonly booking: T,
  ) {}
}
