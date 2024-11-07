import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'src/shared/constants/user-role.constant';

export class UpdateUserReqDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  lastName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
