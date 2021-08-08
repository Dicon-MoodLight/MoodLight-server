import { LoginDto } from './login.dto';
import { IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from '../../user/dto/user-nickname.dto';

export class JoinDto extends IntersectionType(UserNicknameDto, LoginDto) {}
