import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvent } from './events/notification.event';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class NotificationService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emitNotification(type: string, booking: Booking): void {
    const event = new NotificationEvent(type, booking);
    this.eventEmitter.emit(type, event);
  }
}
