import { IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from './user-nickname.dto';
import { UserIdDto } from './user-id.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends IntersectionType(
  UserIdDto,
  UserNicknameDto,
) {
  @IsBoolean()
  @IsOptional()
  readonly usePushMessageOnComment: boolean;

  @IsBoolean()
  @IsOptional()
  readonly usePushMessageOnLike: boolean;
}
