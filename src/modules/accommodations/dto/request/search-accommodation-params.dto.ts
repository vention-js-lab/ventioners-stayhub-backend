import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { TransformToDate, TransformToInt } from 'src/shared/transformers';

export class SearchAccommodationQueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description:
      'Search query to find accommodations by name, description, or location',
    default: '',
  })
  search?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category ID to filter accommodations by category',
    default: '',
  })
  categoryId?: string;

  @TransformToDate()
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    type: Date,
    description: 'Start date for accommodation availability filter',
    default: '',
  })
  fromDate?: Date;

  @TransformToDate()
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    type: Date,
    description: 'End date for accommodation availability filter',
    default: '',
  })
  toDate?: Date;

  @TransformToInt()
  @IsInt()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  page?: number = 1;

  @TransformToInt()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page for pagination',
    default: 10,
  })
  limit?: number = 10;
}
