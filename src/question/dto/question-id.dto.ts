import { IsUUID } from 'class-validator';

export class QuestionIdDto {
  @IsUUID()
  readonly questionId: string;
}
