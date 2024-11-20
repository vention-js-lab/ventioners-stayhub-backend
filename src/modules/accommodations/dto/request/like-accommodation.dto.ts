import { IsUUID } from 'class-validator';

export class LikeAccommodationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  accommodationId: string;
}
