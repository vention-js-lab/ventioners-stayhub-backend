import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../constants';
import { TransformToUpperCase } from 'src/shared/transformers';

export class BookingsQueryParamsReqDto {
  @TransformToUpperCase()
  @IsEnum(BookingStatus)
  @IsOptional()
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  status?: BookingStatus;
}
