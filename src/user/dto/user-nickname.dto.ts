import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserNicknameDto {
  @ApiProperty({ description: '사용자 닉네임' })
  @Length(3, 13)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
