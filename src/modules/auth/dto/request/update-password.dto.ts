import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  newPassword: string;
}
