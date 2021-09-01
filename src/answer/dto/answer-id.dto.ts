import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerIdDto {
  @ApiProperty({ description: '답변 id' })
  @Min(1)
  @IsNumber()
  readonly answerId: number;
}
