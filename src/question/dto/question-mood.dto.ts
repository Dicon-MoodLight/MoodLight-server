import { IsString, Length } from 'class-validator';
import { Mood } from '../types/question';

export class QuestionMoodDto {
  @IsString()
  @Length(3, 5)
  readonly mood: Mood;
}
