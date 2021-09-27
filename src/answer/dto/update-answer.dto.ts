import { IsOptional } from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';
import { IntersectionType } from '@nestjs/swagger';
import { AnswerIdDto } from './answer-id.dto';

export class UpdateAnswerDto extends IntersectionType(
  CreateAnswerDto,
  AnswerIdDto,
) {
  @IsOptional()
  readonly questionId: string;

  @IsOptional()
  readonly contents: string;
}
