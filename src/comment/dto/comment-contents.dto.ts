import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CommentContentsDto {
  @ApiProperty({ description: '질문 내용' })
  @IsString()
  @Length(1, 150)
  readonly contents: string;
}
