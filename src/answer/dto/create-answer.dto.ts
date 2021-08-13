import { IntersectionType } from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { QuestionIdDto } from '../../question/dto/question-id.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto extends IntersectionType(
  OptionalUserIdDto,
  QuestionIdDto,
) {
  @IsBoolean()
  readonly private: boolean;

  @IsBoolean()
  readonly allow_comment: boolean;

  @IsNotEmpty()
  @IsString()
  readonly contents: string;
}
