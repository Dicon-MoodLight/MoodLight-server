import { Answer } from '../entity/answer.entity';
import { Question } from '../../question/entity/question.entity';

export class AnswerIncludesQuestionDto extends Answer {
  readonly question: Question;
}
