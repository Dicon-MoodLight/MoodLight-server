import { IntersectionType } from '@nestjs/swagger';
import { UserPasswordDto } from '../../user/dto/user-password.dto';
import { UserEmailDto } from '../../user/dto/user-email.dto';

export class LoginDto extends IntersectionType(UserEmailDto, UserPasswordDto) {}
