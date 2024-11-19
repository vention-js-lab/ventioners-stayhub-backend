import { ApiProperty } from '@nestjs/swagger';
import { AccommodationCategoryDto } from './category.dto';

export class GetCategoriesResponseBodyDto {
  @ApiProperty({ isArray: true, type: AccommodationCategoryDto })
  data: AccommodationCategoryDto[];
}
