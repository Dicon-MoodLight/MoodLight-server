import { IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from './user-nickname.dto';
import { UserIdDto } from './user-id.dto';

export class UpdateUserDto extends IntersectionType(
  UserIdDto,
  UserNicknameDto,
) {}
