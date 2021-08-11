import { UserEmailDto } from '../../user/dto/user-email.dto';
import { IsNumberString, Length } from 'class-validator';

export class ConfirmDto extends UserEmailDto {
  @IsNumberString()
  @Length(6, 6)
  confirmCode: string;
}
