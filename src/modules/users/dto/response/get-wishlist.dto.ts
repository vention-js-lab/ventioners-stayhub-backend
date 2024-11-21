import { ApiProperty } from '@nestjs/swagger';
import { AccommodationDto } from 'src/modules/accommodations/dto';

export class GetWishlistResponseBody {
  @ApiProperty({ isArray: true, type: AccommodationDto })
  data: AccommodationDto[];
}
