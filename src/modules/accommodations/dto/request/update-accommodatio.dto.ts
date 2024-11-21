import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAccommodationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  location: string;

  @IsDecimal()
  @IsNotEmpty()
  pricePerNight: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
