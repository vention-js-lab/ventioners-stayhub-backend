import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { UserDto } from './user.dto';

export class GetUsersResponseBodyDto {
  @ApiProperty({ isArray: true, type: UserDto })
  data: User[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;
}
