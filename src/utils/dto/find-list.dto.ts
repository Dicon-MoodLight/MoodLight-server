import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindListDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-1)
  readonly start: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly take: number;
}
