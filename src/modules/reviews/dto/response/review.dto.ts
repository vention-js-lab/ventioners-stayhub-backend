import { ApiProperty } from '@nestjs/swagger';
import { AccommodationResponseDto } from 'src/modules/accommodations/dto';
import { GetUsersResponseBodyDto } from 'src/modules/users/dto/response';

export class ReviewResponseDto {
  @ApiProperty({ example: 'a3101c02-fa90-44a0-accb-c8ab31b3ecbe' })
  id: string;

  @ApiProperty({ example: '2' })
  rating: number;

  @ApiProperty({ type: GetUsersResponseBodyDto })
  user: GetUsersResponseBodyDto;

  @ApiProperty({ type: AccommodationResponseDto })
  accommodation: AccommodationResponseDto;

  @ApiProperty({ example: '2024-11-24T10:24:02.585Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-24T10:24:02.585Z' })
  updatedAt: string;
}
