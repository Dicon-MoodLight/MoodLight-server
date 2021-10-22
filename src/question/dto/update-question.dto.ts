import { QuestionIdDto } from './question-id.dto';
import { IntersectionType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsOptional } from 'class-validator';
import { Mood } from '../types/question';

export class UpdateQuestionDto extends IntersectionType(
  QuestionIdDto,
  CreateQuestionDto,
) {
  @IsOptional()
  readonly contents: string;

  @IsOptional()
  readonly mood: Mood;

  @IsOptional()
  readonly activatedDate: string;
}
