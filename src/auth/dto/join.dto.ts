import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { LoginDto } from './login.dto';
import { UserNicknameDto } from '../../user/dto/user-nickname.dto';

export class JoinDto extends IntersectionType(UserNicknameDto, LoginDto) {
  @IsOptional()
  @IsString()
  readonly adminKey: string;
}
