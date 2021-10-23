import { CreateAnswerDto } from './create-answer.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { AnswerIdDto } from './answer-id.dto';

export class UpdateAnswerDto extends IntersectionType(
  PartialType(CreateAnswerDto),
  AnswerIdDto,
) {}
