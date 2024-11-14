import { ApiProperty } from '@nestjs/swagger';
import { AccommodationDto } from './accommodation.dto';

export class GetManyAccommodationResponseDto {
  @ApiProperty({ type: AccommodationDto, isArray: true })
  data: AccommodationDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
