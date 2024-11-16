import {
  IsDate,
  IsOptional,
  IsString,
  Min,
  IsInt,
  Max,
  IsUUID,
} from 'class-validator';
import { TransformToDate, TransformToInt } from 'src/shared/decorators';

export class SearchAccommodationQueryParamsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @TransformToDate()
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @TransformToDate()
  @IsDate()
  @IsOptional()
  toDate?: Date;

  @TransformToInt()
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @TransformToInt()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}