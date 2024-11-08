import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/shared/constants';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  passwordHash: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserDataResponseBodyDto {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}
