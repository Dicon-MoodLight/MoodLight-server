import { QuestionIdDto } from './question-id.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends IntersectionType(
  QuestionIdDto,
  PartialType(CreateQuestionDto),
) {}
