import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({ description: '사용자 아이디' })
  @IsUUID()
  readonly userId: string;
}
