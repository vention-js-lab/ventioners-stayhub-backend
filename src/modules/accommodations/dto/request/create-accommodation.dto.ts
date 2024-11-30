import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TransformToNumber } from 'src/shared/transformers';
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

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ default: 'Malibu, California', maxLength: 200 })
  location: string;

  @TransformToNumber()
  @IsNumber()
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

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    default: 'categoryId',
    description: 'Category ID of the accommodation',
  })
  categoryId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Longitude coordinate of the accommodation' })
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Latitude coordinate of the accommodation' })
  latitude: number;
}
