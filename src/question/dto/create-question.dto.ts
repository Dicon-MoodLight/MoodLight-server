import { IntersectionType } from '@nestjs/swagger';
import { QuestionMoodDto } from './question-mood.dto';
import { CommentContentsDto } from '../../comment/dto/comment-contents.dto';

export class CreateQuestionDto extends IntersectionType(
  QuestionMoodDto,
  CommentContentsDto,
) {}
