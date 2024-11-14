import { ApiProperty } from '@nestjs/swagger';
import { AccommodationDto } from './accommodation.dto';

export class GetManyAccommodationResponseDto {
  @ApiProperty({ type: AccommodationDto, isArray: true })
  items: AccommodationDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
