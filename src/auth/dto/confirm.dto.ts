import { UserEmailDto } from '../../user/dto/user-email.dto';
import { IntersectionType } from '@nestjs/swagger';
import { ConfirmCodeDto } from './confirm-code.dto';

export class ConfirmDto extends IntersectionType(
  UserEmailDto,
  ConfirmCodeDto,
) {}
