import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import {
  QUESTION_CONTENTS_MAX_LENGTH,
  QUESTION_CONTENTS_MIN_LENGTH,
} from '../../constants/length';

export class QuestionContentsDto {
  @ApiProperty({ description: '질문 내용' })
  @IsString()
  @Length(QUESTION_CONTENTS_MIN_LENGTH, QUESTION_CONTENTS_MAX_LENGTH)
  readonly contents: string;
}
