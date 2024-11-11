import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ default: 'example@gmail.com', maxLength: 255 })
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional({ default: 'John', maxLength: 255 })
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional({ default: 'Doe', maxLength: 255 })
  lastName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;
}
