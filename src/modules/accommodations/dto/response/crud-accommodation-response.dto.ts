import { ApiProperty } from '@nestjs/swagger';
import { AmenityDto } from '../../../amenities/dto/response/amenity.dto';
import { AccommodationCategoryDto } from '../../../categories/dto/response/category.dto';
import { GetUsersResponseBodyDto } from 'src/modules/users/dto/response';

export class AccommodationResponseDto {
  @ApiProperty({ example: 'a3101c02-fa90-44a0-accb-c8ab31b3ecbe' })
  id: string;

  @ApiProperty({ example: 'Chimbay cityy' })
  name: string;

  @ApiProperty({ example: 'Chicago' })
  description: string;

  @ApiProperty({ example: ['image'], isArray: true })
  images: string[];

  @ApiProperty({ example: 'Karakalpakistan' })
  location: string;

  @ApiProperty({ example: 200 })
  pricePerNight: number;

  @ApiProperty({ example: 4 })
  numberOfGuests: number;

  @ApiProperty({ type: [AmenityDto] })
  amenities: AmenityDto[];

  @ApiProperty({ type: AccommodationCategoryDto })
  category: AccommodationCategoryDto;

  @ApiProperty({ type: GetUsersResponseBodyDto })
  user: GetUsersResponseBodyDto;

  @ApiProperty({ example: '2024-11-24T10:24:02.585Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-24T10:24:02.585Z' })
  updatedAt: string;
}
