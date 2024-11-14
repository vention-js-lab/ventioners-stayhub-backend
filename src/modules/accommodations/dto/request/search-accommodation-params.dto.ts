import { IsDate, IsOptional, IsString, Min, IsInt, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchAccommodationParamsDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fromDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  toDate: Date;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;
}
