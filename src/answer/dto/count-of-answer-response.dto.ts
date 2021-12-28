import { IsNumber } from 'class-validator';
import { QuestionMoodDto } from '../../question/dto';

export class CountOfAnswerResponseDto extends QuestionMoodDto {
  @IsNumber()
  readonly count: number;
}
