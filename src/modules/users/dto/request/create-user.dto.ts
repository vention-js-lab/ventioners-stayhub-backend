import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/shared/constants/user-role.constant';

export class CreateUserReqDto {
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({ default: 'example@gmail.com', maxLength: 255 })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @ApiProperty({ default: '12345678', minLength: 8, maxLength: 255 })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ default: 'John', maxLength: 255 })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ default: 'Doe', maxLength: 255 })
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;
}
