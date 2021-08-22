import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCodeDto {
  @ApiProperty({ description: '인증 코드' })
  @IsNumberString()
  confirmCode: string;
}
