import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';
import { AccommodationDto } from 'src/modules/accommodations/dto';
import { UserDto } from 'src/modules/users/dto/response';

export class AccommodationWithOwnerDto extends AccommodationDto {
  @ApiProperty()
  owner: UserDto;
}

export class BookingDtoWithUserAndAccommodation extends BookingDto {
  @ApiProperty()
  accommodation: AccommodationWithOwnerDto;

  @ApiProperty()
  user: UserDto;
}

export class GetBookingDto {
  @ApiProperty()
  data: BookingDtoWithUserAndAccommodation;
}
