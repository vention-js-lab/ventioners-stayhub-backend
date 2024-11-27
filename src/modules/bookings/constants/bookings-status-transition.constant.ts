import { BookingStatus } from './booking-status.constant';

export const BookingStatusTransitions: Record<BookingStatus, BookingStatus[]> =
  {
    [BookingStatus.PENDING]: [
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
      BookingStatus.REJECTED,
    ],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.CHECKED_IN,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
    [BookingStatus.CHECKED_OUT]: [BookingStatus.ARCHIVED],
    [BookingStatus.CANCELLED]: [BookingStatus.ARCHIVED],
    [BookingStatus.REJECTED]: [BookingStatus.ARCHIVED],
    [BookingStatus.ARCHIVED]: [],
  } as const;
