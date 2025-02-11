import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { StatusResponse } from '../types/response';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { SUCCESS_RESPONSE } from '../constants/response';
import { AnswerService } from '../answer/answer.service';
import { exceptionHandler } from '../utils/error';
import { IDeleteRequest } from '../types/delete';
import { Answer } from '../answer/entity/answer.entity';
import { LIST_PAGINATION_OPTION } from '../utils/list-pagination-option';
import { requestFCM } from '../utils/fcm';
import { messaging } from 'firebase-admin';
import Message = messaging.Message;

interface IFindComments {
  readonly answerId: number;
  readonly userId: any;
  readonly start: number;
  readonly take: number;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly answerService: AnswerService,
  ) {}

  async findComments({
    answerId,
    userId,
    start,
    take,
  }: IFindComments): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { answer: { id: answerId }, ...LIST_PAGINATION_OPTION(start) },
      order: { user: userId, id: 'DESC' },
      take,
    });
  }

  async getCountByAnswerId(id: number) {
    return await this.commentRepository.count({ answer: { id } });
  }

  async createComment({
    contents,
    answerId,
    userId,
  }: CreateCommentDto): Promise<StatusResponse> {
    try {
      const answer = await this.answerService.findAnswerById(answerId);
      if (answer.private) {
        throw 'Answer is private.';
      }
      const comment = await this.commentRepository.create({
        contents,
        user: { id: userId },
        answer: { id: answerId },
      });
      await this.commentRepository.save(comment);
      await this.answerRepository.update(
        {
          id: answerId,
        },
        { countOfComment: answer.countOfComment + 1 },
      );
      await this.requestPushMessageOnComment(answerId, {
        title: '새 댓글',
        body: '누군가 당신의 답변에 댓글을 달았습니다.',
      });
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async requestPushMessageOnComment(
    answerId: number,
    notification: Message['notification'],
  ): Promise<void> {
    const { firebaseToken, usePushMessageOnComment } = (
      await this.answerService.findAnswerById(answerId, true)
    )?.user;
    if (usePushMessageOnComment) {
      await requestFCM(notification, firebaseToken);
    }
  }

  async updateComment({
    commentId,
    userId,
    contents,
  }: UpdateCommentDto): Promise<StatusResponse> {
    try {
      await this.commentRepository.update(
        { id: commentId, user: { id: userId } },
        { contents },
      );
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteComment({ userId, id }: IDeleteRequest): Promise<StatusResponse> {
    try {
      await this.commentRepository.delete({ id, user: { id: userId } });
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }
}
