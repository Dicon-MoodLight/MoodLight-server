import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UserEmailDto } from './user-email.dto';
import { UserNicknameDto } from './user-nickname.dto';

export class GetUserIsExistDto extends IntersectionType(
  PartialType(UserEmailDto),
  PartialType(UserNicknameDto),
) {}
