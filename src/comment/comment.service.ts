import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { StatusResponse } from '../types/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { throwHttpException } from '../util/error';
import { SUCCESS_RESPONSE } from '../constants/response';
import { AnswerService } from '../answer/answer.service';

interface IFindComments {
  readonly answerId: string;
  readonly userId: any;
  readonly skip: number;
  readonly take: number;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly answerService: AnswerService,
  ) {}

  async findComments({
    answerId,
    userId,
    skip,
    take,
  }: IFindComments): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { answer: { id: answerId } },
      order: { user: userId, id: 'DESC' },
      skip,
      take,
    });
  }

  async createComment({
    contents,
    answerId,
    userId,
  }: CreateCommentDto): Promise<StatusResponse> {
    try {
      const answer = await this.answerService.findAnswerById(answerId);
      if (answer.private) {
        throwHttpException('Answer is private.', HttpStatus.CONFLICT);
      }
      const comment = await this.commentRepository.create({
        contents,
        user: { id: userId },
        answer: { id: answerId },
      });
      await this.commentRepository.save(comment);
    } catch (err) {
      throwHttpException(err, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }
}
