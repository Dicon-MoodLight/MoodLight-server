import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { IStatusResponse } from '../types/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { throwHttpException } from '../util/error';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../constants/response';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly answerService: AnswerService,
  ) {}

  async findCommentsByAnswerId(answerId, userId): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { answer: answerId },
      order: { user: userId, id: 'DESC' },
    });
  }

  async createComment({
    contents,
    answerId,
    userId,
  }: CreateCommentDto): Promise<IStatusResponse> {
    try {
      const answer = await this.answerService.findAnswerById(answerId);
      if (answer.private || answer.allow_comment) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'Answer is private.' },
          HttpStatus.CONFLICT,
        );
      }
      const comment = await this.commentRepository.create({
        contents,
        user: { id: userId },
        answer: { id: answerId },
      });
      await this.commentRepository.save(comment);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }
}
