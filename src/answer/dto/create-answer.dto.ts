import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { QuestionIdDto } from '../../question/dto/question-id.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAnswerDto extends IntersectionType(
  OptionalUserIdDto,
  QuestionIdDto,
) {
  @ApiProperty({ description: '감정 수치' })
  @IsNumber()
  @Min(1)
  @Max(10)
  readonly moodLevel: number;

  @ApiPropertyOptional({ description: '비공개 여부' })
  @IsOptional()
  @IsBoolean()
  readonly private: boolean;

  @ApiPropertyOptional({ description: '댓글 허용 여부' })
  @IsOptional()
  @IsBoolean()
  readonly allow_comment: boolean;

  @ApiProperty({ description: '답변 내용' })
  @IsNotEmpty()
  @IsString()
  readonly contents: string;
}
