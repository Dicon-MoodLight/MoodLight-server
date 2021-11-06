import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindListDto {
  @ApiProperty({ description: '리스트 마지막 원소 id / 첫 로딩에는 0' })
  @Type(() => Number)
  @IsNumber()
  @Min(-1)
  readonly start: number;

  @ApiProperty({ description: '가져올 리스트 원소 갯수' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly take: number;
}
