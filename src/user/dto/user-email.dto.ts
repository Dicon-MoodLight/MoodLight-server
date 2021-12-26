import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEmailDto {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  @Length(3, 320)
  readonly email: string;
}
