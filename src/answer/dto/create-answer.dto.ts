import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';
import { QuestionIdDto } from '../../question/dto';
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
  @IsNumber()
  @Min(1)
  @Max(10)
  readonly moodLevel: number;

  @IsOptional()
  @IsBoolean()
  readonly private: boolean;

  @IsOptional()
  @IsBoolean()
  readonly allow_comment: boolean;

  @IsNotEmpty()
  @IsString()
  readonly contents: string;
}
