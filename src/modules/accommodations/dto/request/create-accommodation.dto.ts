import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TransformToFloat, TransformToInt } from 'src/shared/transformers';

export class CreateAccommodationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  @ApiProperty({ default: 'Beachside Villa', maxLength: 125 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @ApiProperty({
    default: 'A beautiful villa near the beach.',
    maxLength: 2000,
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ default: 'Malibu, California', maxLength: 200 })
  location: string;

  @TransformToFloat()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 200.0, description: 'Price per night' })
  pricePerNight: number;

  @TransformToInt()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 1, description: 'Number of guests' })
  numberOfGuests: number;

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

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location coordinates of the accommodation',
    example: { type: 'Point', coordinates: [69.2348, 41.3268] },
  })
  locationCoordinates: {
    type: string;
    coordinates: [number, number];
  };
}
