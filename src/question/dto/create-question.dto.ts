import { IntersectionType } from '@nestjs/swagger';
import { QuestionMoodDto } from './question-mood.dto';
import { QuestionActivatedDateDto } from './question-activated-date.dto';
import { QuestionContentsDto } from './question-contents.dto';

export class CreateQuestionDto extends IntersectionType(
  QuestionContentsDto,
  IntersectionType(QuestionMoodDto, QuestionActivatedDateDto),
) {}
