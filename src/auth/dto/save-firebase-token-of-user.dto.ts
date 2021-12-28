import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LoginDto } from './login.dto';
import { USER_FIREBASE_TOKEN_MAX_LENGTH } from '../../constants/length';

export class SaveFirebaseTokenOfUserDto extends LoginDto {
  @IsString()
  @MaxLength(USER_FIREBASE_TOKEN_MAX_LENGTH)
  @IsNotEmpty()
  firebaseToken: string;
}
