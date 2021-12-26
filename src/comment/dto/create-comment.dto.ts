import { IntersectionType } from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { AnswerIdDto } from '../../answer/dto/answer-id.dto';
import { CommentContentsDto } from './comment-contents.dto';

export class CreateCommentDto extends IntersectionType(
  OptionalUserIdDto,
  IntersectionType(AnswerIdDto, CommentContentsDto),
) {}
