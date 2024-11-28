import { ApiProperty } from '@nestjs/swagger';

class ImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ type: 'integer' })
  order: number;
}

export class AccommodationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  pricePerNight: number;

  @ApiProperty({ type: 'array' })
  images: ImageDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
