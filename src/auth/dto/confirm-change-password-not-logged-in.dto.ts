import { IntersectionType } from '@nestjs/swagger';
import { ConfirmDto } from './confirm.dto';
import { UserPasswordDto } from '../../user/dto/user-password.dto';

export class ConfirmChangePasswordNotLoggedInDto extends IntersectionType(
  ConfirmDto,
  UserPasswordDto,
) {}
