import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchField } from 'src/shared/validators/match-field.validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @MaxLength(22, {
    message: 'Password is too long. Maximum length is 22 characters.',
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;

  @IsString()
  @MatchField('password', { message: 'Password confirmation should match.' })
  passwordConfirmation: string;

  @IsString()
  @IsNotEmpty({ message: 'First name must not be empty' })
  first_name: string;

  @IsString()
  last_name: string;
}
