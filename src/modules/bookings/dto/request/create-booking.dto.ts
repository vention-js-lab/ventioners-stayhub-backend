import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsUUID, Min } from 'class-validator';
import {
  TransformToDate,
  TransformToYearMonthDay,
} from 'src/shared/transformers';
import { IsAfter, IsFutureDate } from 'src/shared/validators';

export class CreateBookingReqDto {
  @IsUUID('4')
  @ApiProperty()
  accommodationId: string;

  @TransformToDate()
  @TransformToYearMonthDay()
  @IsDate()
  @IsFutureDate()
  @ApiProperty()
  checkInDate: Date;

  @TransformToDate()
  @TransformToYearMonthDay()
  @IsDate()
  @IsFutureDate()
  @IsAfter('checkInDate')
  @ApiProperty()
  checkOutDate: Date;

  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  numberOfGuests: number;
}
