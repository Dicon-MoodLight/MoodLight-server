import { IsEmail, Length } from 'class-validator';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_EMAIL_MIN_LENGTH,
} from '../../constants/length';

export class UserEmailDto {
  @IsEmail()
  @Length(USER_EMAIL_MIN_LENGTH, USER_EMAIL_MAX_LENGTH)
  readonly email: string;
}
