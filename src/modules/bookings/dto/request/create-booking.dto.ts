import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsUUID, Min } from 'class-validator';
import { TransformToDate } from 'src/shared/transformers';
import { TransformToYearMonthDay } from 'src/shared/transformers/transform-to-year-month-day.transformer';
import { IsAfter } from 'src/shared/validators/is-date-after.validator';
import { IsFutureDate } from 'src/shared/validators/is-future-date.validator';

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
