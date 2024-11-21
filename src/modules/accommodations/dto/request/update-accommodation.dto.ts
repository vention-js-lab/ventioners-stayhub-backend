import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAccommodationDto {
  @IsString()
  @IsOptional()
  @MaxLength(125)
  @ApiPropertyOptional({
    description: 'Name of the accommodation',
    maxLength: 125,
    example: 'Beachside Villa',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Description of the accommodation',
    maxLength: 255,
    example: 'A beautiful villa near the beach.',
  })
  description?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of image URLs for the accommodation',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  images?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(200)
  @ApiPropertyOptional({
    description: 'Location of the accommodation',
    maxLength: 200,
    example: 'Malibu, California',
  })
  location?: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Price per night for the accommodation',
    example: 200.0,
  })
  pricePerNight?: number;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of amenity IDs for the accommodation (optional)',
    type: [String],
    example: ['amenity1', 'amenity2'],
  })
  amenities?: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Category ID of the accommodation',
    example: 'categoryId',
  })
  categoryId?: string;
}
