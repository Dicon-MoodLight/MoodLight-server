import { IsString } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { AnswerIdDto } from '../../answer/dto/answer-id.dto';

export class CreateCommentDto extends IntersectionType(
  OptionalUserIdDto,
  AnswerIdDto,
) {
  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  readonly contents: string;
}
