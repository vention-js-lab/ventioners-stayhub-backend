import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAccommodationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  @ApiProperty({ default: 'Beachside Villa', maxLength: 125 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ default: 'A beautiful villa near the beach.', maxLength: 255 })
  description: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: [String],
    default: ['image1.jpg', 'image2.jpg'],
    description: 'Array of image URLs',
  })
  images: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ default: 'Malibu, California', maxLength: 200 })
  location: string;

  @IsNotEmpty()
  @ApiProperty({ default: 200.0, description: 'Price per night' })
  pricePerNight: number;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    default: ['amenity1', 'amenity2'],
    description: 'Array of amenity IDs',
  })
  amenities?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'categoryId',
    description: 'Category ID of the accommodation',
  })
  categoryId: string;
}
