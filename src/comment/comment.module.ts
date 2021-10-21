import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entity/comment.entity';
import { AnswerService } from '../answer/answer.service';
import { Answer } from '../answer/entity/answer.entity';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/entity/question.entity';
import { AnswerLike } from '../answer/entity/answer-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Answer, Question, AnswerLike])],
  providers: [CommentService, AnswerService, QuestionService],
  controllers: [CommentController],
})
export class CommentModule {}
