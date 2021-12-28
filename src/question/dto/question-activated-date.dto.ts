import { IsString, Length } from 'class-validator';

export class QuestionActivatedDateDto {
  @Length(8)
  @IsString()
  readonly activatedDate: string;
}
