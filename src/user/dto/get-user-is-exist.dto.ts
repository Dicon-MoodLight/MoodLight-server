import { IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserEmailDto } from './user-email.dto';
import { UserNicknameDto } from './user-nickname.dto';

export class GetUserIsExistDto extends IntersectionType(
  UserEmailDto,
  UserNicknameDto,
) {
  @IsOptional()
  readonly email: string;

  @IsOptional()
  readonly nickname: string;
}
