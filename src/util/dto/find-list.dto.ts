import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindListDto {
  @ApiProperty({ description: '시작 id' })
  @IsNumberString()
  readonly skip: number;

  @ApiProperty({ description: '가져올 리스트 길이' })
  @IsNumberString()
  readonly take: number;
}
