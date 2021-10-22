import { IntersectionType } from '@nestjs/swagger';
import { QuestionMoodDto } from './question-mood.dto';
import { CommentContentsDto } from '../../comment/dto/comment-contents.dto';
import { QuestionActivatedDateDto } from './question-activated-date.dto';

export class CreateQuestionDto extends IntersectionType(
  IntersectionType(QuestionMoodDto, QuestionActivatedDateDto),
  CommentContentsDto,
) {}
