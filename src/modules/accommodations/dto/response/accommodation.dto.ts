import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
