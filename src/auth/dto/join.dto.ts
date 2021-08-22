import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { LoginDto } from './login.dto';
import { UserNicknameDto } from '../../user/dto/user-nickname.dto';

export class JoinDto extends IntersectionType(UserNicknameDto, LoginDto) {
  @ApiPropertyOptional({ description: '관리자 키' })
  @IsOptional()
  @IsString()
  readonly adminKey: string;
}
