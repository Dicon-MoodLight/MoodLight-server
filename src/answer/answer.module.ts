import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from './entity/answer.entity';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/entity/question.entity';
import { AnswerLike } from './entity/answer-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, AnswerLike])],
  providers: [AnswerService, QuestionService],
  controllers: [AnswerController],
})
export class AnswerModule {}
