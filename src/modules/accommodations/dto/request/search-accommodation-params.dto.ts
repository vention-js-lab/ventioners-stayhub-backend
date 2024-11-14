import { IsDate, IsOptional, IsString, Min, IsInt, Max } from 'class-validator';

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
  fromDate: Date;

  @IsDate()
  @IsOptional()
  toDate: Date;

  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
