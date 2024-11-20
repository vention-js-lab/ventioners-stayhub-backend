import { ApiProperty } from '@nestjs/swagger';
import { AmenityDto } from './amenity.dto';

export class GetAmenitiesResponseDto {
  @ApiProperty({ type: AmenityDto, isArray: true })
  data: AmenityDto[];
}
