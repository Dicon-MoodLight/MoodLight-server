import { IntersectionType } from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { CommentIdDto } from './comment-id.dto';
import { CommentContentsDto } from './comment-contents.dto';

export class UpdateCommentDto extends IntersectionType(
  IntersectionType(CommentIdDto, CommentContentsDto),
  OptionalUserIdDto,
) {}
