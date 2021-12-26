import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_EMAIL_MIN_LENGTH,
} from '../../constants/length';

export class UserEmailDto {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  @Length(USER_EMAIL_MIN_LENGTH, USER_EMAIL_MAX_LENGTH)
  readonly email: string;
}
