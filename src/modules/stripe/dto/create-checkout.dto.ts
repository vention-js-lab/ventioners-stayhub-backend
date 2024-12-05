import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCheckoutDto {
  @IsUUID()
  @IsNotEmpty()
  accommodationId: string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
}
