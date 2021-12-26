import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SaveFirebaseTokenOfUserDto extends LoginDto {
  @ApiProperty({ description: '파이어베이스 디바이스 토큰' })
  @IsString()
  @IsNotEmpty()
  firebaseToken: string;
}
