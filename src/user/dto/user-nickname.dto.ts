import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from '../../constants/length';

export class UserNicknameDto {
  @ApiProperty({ description: '사용자 닉네임' })
  @Length(USER_NICKNAME_MIN_LENGTH, USER_NICKNAME_MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
