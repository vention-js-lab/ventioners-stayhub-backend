import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvent } from './events/notification.event';

@Injectable()
export class NotificationService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emitNotification<T>(type: string, bookingId: T): void {
    const event = new NotificationEvent(type, bookingId);
    this.eventEmitter.emit(type, event);
  }
}
