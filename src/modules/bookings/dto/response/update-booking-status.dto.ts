import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';

export class UpdateBookingStatusDto {
  @ApiProperty()
  data: BookingDto;
}
