import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';
import { AccommodationWithOwnerDto } from './get-booking.dto';

class BoookingWithAccommodationAndOwner extends BookingDto {
  @ApiProperty()
  accommodation: AccommodationWithOwnerDto;
}

export class UpdateBookingStatusResponseDto {
  @ApiProperty()
  data: BoookingWithAccommodationAndOwner;
}
