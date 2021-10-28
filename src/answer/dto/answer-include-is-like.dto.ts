import { Answer } from '../entity/answer.entity';
import { IsBoolean } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { AnswerIncludesQuestionDto } from './answer-includes-question.dto';

export class AnswerIncludeIsLikeDto extends PartialType(Answer) {
  @ApiProperty({ description: '좋아요 클릭 여부' })
  @IsBoolean()
  isLike: boolean;
}

export class AnswerIncludeIsLikeAndQuestionDto extends IntersectionType(
  AnswerIncludesQuestionDto,
  AnswerIncludeIsLikeDto,
) {}
