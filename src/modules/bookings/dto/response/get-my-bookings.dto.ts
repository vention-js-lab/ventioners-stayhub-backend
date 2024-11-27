import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';
import { AccommodationDto } from 'src/modules/accommodations/dto';

export class BookingDtoWithAccommodation extends BookingDto {
  @ApiProperty()
  accommodation: AccommodationDto;
}

export class GetMyBookingsDto {
  @ApiProperty({ isArray: true, type: BookingDtoWithAccommodation })
  data: BookingDtoWithAccommodation[];
}
