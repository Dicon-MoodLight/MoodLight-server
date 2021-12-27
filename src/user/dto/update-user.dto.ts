import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UserNicknameDto } from './user-nickname.dto';
import { UserIdDto } from './user-id.dto';
import { UserUsePushMessageDto } from './user-use-push-message.dto';

export class UpdateUserDto extends IntersectionType(
  UserIdDto,
  IntersectionType(
    PartialType(UserNicknameDto),
    PartialType(UserUsePushMessageDto),
  ),
) {}
