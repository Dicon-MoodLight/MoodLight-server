import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from './user-nickname.dto';
import { UserIdDto } from './user-id.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends IntersectionType(
  UserIdDto,
  UserNicknameDto,
) {
  @ApiProperty({ description: '푸시알림 여부: 댓글' })
  @IsBoolean()
  @IsOptional()
  readonly usePushMessageOnComment: boolean;

  @ApiProperty({ description: '푸시알림 여부: 좋아요' })
  @IsBoolean()
  @IsOptional()
  readonly usePushMessageOnLike: boolean;
}
