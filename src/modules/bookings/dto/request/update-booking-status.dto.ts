import { IsEnum } from 'class-validator';
import { BookingStatus } from '../../constants/booking-status.constant';
import { ApiProperty } from '@nestjs/swagger';
import { TransformToUpperCase } from 'src/shared/transformers';

export class UpdateBookingStatusReqDto {
  @TransformToUpperCase()
  @IsEnum(BookingStatus)
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  status: BookingStatus;
}
