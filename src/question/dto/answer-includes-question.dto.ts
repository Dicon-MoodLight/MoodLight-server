import { Answer } from '../../answer/entity/answer.entity';
import { Question } from '../entity/question.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerIncludesQuestionDto extends Answer {
  @ApiProperty({ description: '질문 데이터' })
  readonly question: Question;
}
