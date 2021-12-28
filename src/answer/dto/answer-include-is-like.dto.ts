import { Answer } from '../entity/answer.entity';
import { IsBoolean } from 'class-validator';
import { AnswerIncludesQuestionDto } from './answer-includes-question.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export class AnswerIncludeIsLikeDto extends PartialType(Answer) {
  @IsBoolean()
  isLike: boolean;
}

export class AnswerIncludeIsLikeAndQuestionDto extends IntersectionType(
  AnswerIncludesQuestionDto,
  AnswerIncludeIsLikeDto,
) {}
