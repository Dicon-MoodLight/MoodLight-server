import { IsNumberString } from 'class-validator';

export class ConfirmCodeDto {
  @IsNumberString()
  confirmCode: string;
}
