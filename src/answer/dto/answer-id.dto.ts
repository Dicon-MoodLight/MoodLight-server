import { IsNumber, Min } from 'class-validator';

export class AnswerIdDto {
  @Min(1)
  @IsNumber()
  readonly answerId: number;
}
