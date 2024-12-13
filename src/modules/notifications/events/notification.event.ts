export class NotificationEvent<T = any> {
  constructor(
    public readonly type: string,
    public readonly bookingId: T,
  ) {}
}
