import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateStripeCheckoutDto {
  @IsUUID()
  @IsNotEmpty()
  accommodationId: string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
}
