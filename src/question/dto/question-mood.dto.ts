import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Mood } from '../types/question';

export class QuestionMoodDto {
  @ApiProperty({ description: '기분' })
  @IsString()
  @Length(3, 5)
  readonly mood: Mood;
}
