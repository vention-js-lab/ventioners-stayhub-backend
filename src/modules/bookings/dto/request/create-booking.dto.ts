import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsUUID, Min } from 'class-validator';
import { TransformToDate } from 'src/shared/transformers';

export class CreateBookingReqDto {
  @IsUUID('4')
  @ApiProperty()
  accommodationId: string;

  @TransformToDate()
  @IsDate()
  @ApiProperty()
  checkInDate: Date;

  @TransformToDate()
  @IsDate()
  @ApiProperty()
  checkOutDate: Date;

  @IsInt()
  @Min(1)
  @ApiProperty({ type: 'integer' })
  numberOfGuests: number;
}
