import { IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { AnswerIdDto } from '../../answer/dto/answer-id.dto';

export class CreateCommentDto extends IntersectionType(
  OptionalUserIdDto,
  AnswerIdDto,
) {
  @IsString()
  readonly contents: string;
}
