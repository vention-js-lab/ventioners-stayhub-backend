import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsUUID, Min } from 'class-validator';
import { TransformToYearMonthDay } from 'src/shared/transformers/transform-to-year-month-day.transformer';

export class CreateBookingReqDto {
  @IsUUID('4')
  @ApiProperty()
  accommodationId: string;

  @TransformToYearMonthDay()
  @IsDate()
  @ApiProperty()
  checkInDate: Date;

  @TransformToYearMonthDay()
  @IsDate()
  @ApiProperty()
  checkOutDate: Date;

  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  numberOfGuests: number;
}
