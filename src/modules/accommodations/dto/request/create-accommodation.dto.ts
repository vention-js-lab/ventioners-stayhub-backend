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
import { TransformToJson, TransformToNumber } from 'src/shared/transformers';

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

  @IsNotEmpty()
  @IsObject()
  @TransformToJson()
  @ApiProperty({
    description:
      'The position of the accommodation with latitude and longitude.',
    example: { latitude: 34.0259, longitude: -118.7798 },
  })
  location: {
    latitude: number;
    longitude: number;
  };

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
}
