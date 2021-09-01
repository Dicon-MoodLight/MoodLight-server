import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionIdDto {
  @ApiProperty({ description: '질문 id' })
  @IsUUID()
  readonly questionId: string;
}
