import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_PLAIN_PASSWORD_MAX_LENGTH,
  USER_PLAIN_PASSWORD_MIN_LENGTH,
} from '../../constants/length';

export class UserPasswordDto {
  @ApiProperty({ description: '비밀번호' })
  @Length(USER_PLAIN_PASSWORD_MIN_LENGTH, USER_PLAIN_PASSWORD_MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
