import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindListDto {
  @ApiProperty({ description: '시작 id' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly skip: number;

  @ApiProperty({ description: '가져올 리스트 길이' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly take: number;
}
