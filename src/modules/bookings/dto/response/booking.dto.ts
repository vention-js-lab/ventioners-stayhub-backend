import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../constants/booking-status.constant';

export class BookingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  checkInDate: Date;

  @ApiProperty()
  checkOutDate: Date;

  @ApiProperty({ type: 'number' })
  totalPrice: number;

  @ApiProperty({ type: 'integer' })
  numberOfGuests: number;

  @ApiProperty({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
