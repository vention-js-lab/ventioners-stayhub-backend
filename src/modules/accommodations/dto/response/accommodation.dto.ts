import { ApiProperty } from '@nestjs/swagger';

export class AccommodationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  amenityIds: string[];

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
