import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';

class AccommodationIdDto {
  @ApiProperty()
  id: string;
}

class UserIdDto {
  @ApiProperty()
  id: string;
}

export class BookingDtoWithAccommodationAndUserId extends BookingDto {
  @ApiProperty()
  user: UserIdDto;

  @ApiProperty()
  accommodation: AccommodationIdDto;
}

export class CreateBookingDto {
  @ApiProperty()
  data: BookingDtoWithAccommodationAndUserId;
}
