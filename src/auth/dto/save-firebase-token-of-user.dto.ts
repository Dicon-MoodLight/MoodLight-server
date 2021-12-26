import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LoginDto } from './login.dto';
import { ApiProperty } from '@nestjs/swagger';
import { USER_FIREBASE_TOKEN_MAX_LENGTH } from '../../constants/length';

export class SaveFirebaseTokenOfUserDto extends LoginDto {
  @ApiProperty({ description: '파이어베이스 디바이스 토큰' })
  @IsString()
  @MaxLength(USER_FIREBASE_TOKEN_MAX_LENGTH)
  @IsNotEmpty()
  firebaseToken: string;
}
