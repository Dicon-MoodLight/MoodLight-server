import { IsString, Length } from 'class-validator';
import {
  QUESTION_CONTENTS_MAX_LENGTH,
  QUESTION_CONTENTS_MIN_LENGTH,
} from '../../constants/length';

export class QuestionContentsDto {
  @IsString()
  @Length(QUESTION_CONTENTS_MIN_LENGTH, QUESTION_CONTENTS_MAX_LENGTH)
  readonly contents: string;
}
