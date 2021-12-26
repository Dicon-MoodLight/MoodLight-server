import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import {
  COMMENT_CONTENTS_MAX_LENGTH,
  COMMENT_CONTENTS_MIN_LENGTH,
} from '../../constants/length';

export class CommentContentsDto {
  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  @Length(COMMENT_CONTENTS_MIN_LENGTH, COMMENT_CONTENTS_MAX_LENGTH)
  readonly contents: string;
}
