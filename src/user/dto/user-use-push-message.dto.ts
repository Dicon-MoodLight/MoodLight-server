import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUsePushMessageDto {
  @IsBoolean()
  @ApiProperty({ description: '푸시알림 사용 여부' })
  usePushMessage: boolean;
}
