import { IsNumber, Min } from 'class-validator';

export class CommentIdDto {
  @IsNumber()
  @Min(1)
  readonly commentId: number;
}
