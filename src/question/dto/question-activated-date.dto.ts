import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QUESTION_ACTIVATED_DATE_FORMAT } from '../../constants/format';

export class QuestionActivatedDateDto {
  @ApiProperty({ description: `활성화 날짜 ${QUESTION_ACTIVATED_DATE_FORMAT}` })
  @Length(8)
  @IsString()
  readonly activatedDate: string;
}
