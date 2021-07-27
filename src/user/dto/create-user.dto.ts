import { IsOptional, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from './user-nickname.dto';
import { UserEmailDto } from './user-email.dto';
import { UserPasswordDto } from './user-password.dto';

export class CreateUserDto extends IntersectionType(
  IntersectionType(UserEmailDto, UserPasswordDto),
  UserNicknameDto,
) {
  @IsOptional()
  @IsString()
  readonly admin_key: string;
}
