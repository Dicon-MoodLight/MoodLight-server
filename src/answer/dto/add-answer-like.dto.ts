import { IntersectionType } from '@nestjs/swagger';
import { AnswerIdDto } from './answer-id.dto';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';

export class AddAnswerLikeDto extends IntersectionType(
  OptionalUserIdDto,
  AnswerIdDto,
) {}
