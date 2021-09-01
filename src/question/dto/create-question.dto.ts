import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ description: '질문 내용' })
  @IsString()
  @Length(1, 150)
  readonly contents: string;
}
