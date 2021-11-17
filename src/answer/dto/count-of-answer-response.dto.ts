import { IsNumber } from 'class-validator';
import { QuestionMoodDto } from '../../question/dto/question-mood.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CountOfAnswerResponseDto extends QuestionMoodDto {
  @ApiProperty({ description: '갯수' })
  @IsNumber()
  readonly count: number;
}
