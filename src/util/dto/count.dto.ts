import { IsNumber, Min } from 'class-validator';

export class CountDto {
  @IsNumber()
  @Min(0)
  count: number;
}
