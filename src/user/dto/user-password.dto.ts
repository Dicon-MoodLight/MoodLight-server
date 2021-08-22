import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPasswordDto {
  @ApiProperty({ description: '비밀번호' })
  @Length(6, 24)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
