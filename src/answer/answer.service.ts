import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOneOptions, Repository } from 'typeorm';
import * as moment from 'moment';
import { Answer } from './entity/answer.entity';
import { StatusResponse } from '../types/response';
import { SUCCESS_RESPONSE } from '../constants/response';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { QuestionService } from '../question/question.service';
import { exceptionHandler } from '../utils/error';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { moodList } from '../question/types/question';
import { CountOfAnswerResponseDto } from './dto/count-of-answer-response.dto';
import { IDeleteRequest } from '../types/delete';
import { AddAnswerLikeDto } from './dto/add-answer-like.dto';
import { AnswerLike } from './entity/answer-like.entity';
import {
  AnswerIncludeIsLikeAndQuestionDto,
  AnswerIncludeIsLikeDto,
} from './dto/answer-include-is-like.dto';
import { AnswerIncludesQuestionDto } from './dto/answer-includes-question.dto';
import { LIST_PAGINATION_OPTION } from '../utils/list-pagination-option';
import { QUESTION_ACTIVATED_DATE_FORMAT } from '../constants/format';
import { DEFAULT_EXCEPTION } from '../constants/exception';
import { requestFCM } from '../utils/fcm';
import { messaging } from 'firebase-admin';
import Message = messaging.Message;

interface IFindAnswers {
  readonly userId: any;
  readonly start: number;
  readonly take: number;
  readonly questionId?: string;
}

interface IFindAnswerByUserIdAndActivatedDate {
  readonly userId: string;
  readonly activatedDate: string;
}

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(AnswerLike)
    private readonly answerLikeRepository: Repository<AnswerLike>,
    private readonly questionService: QuestionService,
  ) {}

  async answersIncludeIsLikePipeline<
    T extends AnswerIncludeIsLikeDto | AnswerIncludeIsLikeAndQuestionDto,
  >({
    answers,
    userId,
  }: {
    answers: AnswerIncludesQuestionDto[] | Answer[];
    userId: string;
  }): Promise<T[]> {
    const newAnswers: T[] = [];
    for (const answer of answers) {
      const isLike = !!(await this.findAnswerLikeByUserIdAndAnswerId({
        userId,
        answerId: answer.id,
      }));
      newAnswers.push({ isLike, ...answer } as T);
    }
    return newAnswers;
  }

  async getCountOfAnswers(
    activatedDate: string,
  ): Promise<CountOfAnswerResponseDto[]> {
    const countOfAnswers: CountOfAnswerResponseDto[] = [];
    for (const mood of moodList) {
      const id = (
        await this.questionService.findQuestions({ activatedDate, mood })
      )[0]?.id;
      let count = 0;
      if (id) {
        count = await this.answerRepository.count({
          where: { question: { id } },
        });
      }
      countOfAnswers.push({ mood, count });
    }
    return countOfAnswers;
  }

  async findAnswerById(id: number, includeUser = false): Promise<Answer> {
    let conditions: FindOneOptions<Answer> = {
      where: { id },
    };
    if (includeUser) {
      conditions = { ...conditions, relations: ['user'] };
    }
    return await this.answerRepository.findOne(conditions);
  }

  async findAnswerByUserIdAndActivatedDate({
    userId,
    activatedDate,
  }: IFindAnswerByUserIdAndActivatedDate): Promise<Answer> {
    return await this.answerRepository.findOne({
      user: { id: userId },
      createdDate: Between(
        `${activatedDate} 00:00:00`,
        `${activatedDate} 23:59:59`,
      ),
    });
  }

  async findAllMyAnswers(userId): Promise<AnswerIncludesQuestionDto[]> {
    return await this.answerRepository.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
      relations: ['question'],
    });
  }

  async findMyAnswers({
    userId,
    start,
    take,
  }: IFindAnswers): Promise<AnswerIncludesQuestionDto[]> {
    return await this.answerRepository.find({
      where: { user: { id: userId }, ...LIST_PAGINATION_OPTION(start) },
      order: { id: 'DESC' },
      relations: ['question'],
      take,
    });
  }

  async findAnswers({
    questionId,
    userId,
    start,
    take,
  }: IFindAnswers): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: {
        question: { id: questionId },
        private: false,
        ...LIST_PAGINATION_OPTION(start),
      },
      order: { user: userId, id: 'DESC' },
      take,
    });
  }

  async findAnswerLikeByUserIdAndAnswerId({
    userId,
    answerId,
  }: {
    userId: string;
    answerId: number;
  }): Promise<AnswerLike> {
    return await this.answerLikeRepository.findOne({
      user: { id: userId },
      answer: { id: answerId },
    });
  }

  private async createAnswerLike({ userId, answerId }): Promise<void> {
    const newAnswerLike = await this.answerLikeRepository.create({
      user: { id: userId },
      answer: { id: answerId },
    });
    await this.answerLikeRepository.save(newAnswerLike);
    await this.requestPushMessageOnLike(answerId, {
      title: '새 좋아요',
      body: '누군가 당신의 답변을 좋아합니다.',
    });
  }

  async requestPushMessageOnLike(
    answerId: number,
    notification: Message['notification'],
  ): Promise<void> {
    const { firebaseToken, usePushMessageOnLike } = (
      await this.findAnswerById(answerId, true)
    )?.user;
    if (usePushMessageOnLike) {
      await requestFCM(notification, firebaseToken);
    }
  }

  async addAnswerLike({
    userId,
    answerId,
  }: AddAnswerLikeDto): Promise<StatusResponse> {
    try {
      const { likes } = await this.findAnswerById(answerId);
      const answerLikeIsExist = !!(await this.findAnswerLikeByUserIdAndAnswerId(
        {
          userId,
          answerId,
        },
      ));
      if (!answerLikeIsExist) {
        await Promise.all([
          this.createAnswerLike({ userId, answerId }),
          this.answerRepository.update(answerId, { likes: likes + 1 }),
        ]);
      }
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async removeAnswerLike({
    userId,
    answerId,
  }: AddAnswerLikeDto): Promise<StatusResponse> {
    try {
      const { likes } = await this.findAnswerById(answerId);
      await Promise.all([
        this.answerLikeRepository.delete({
          user: { id: userId },
          answer: { id: answerId },
        }),
        this.answerRepository.update(answerId, { likes: likes - 1 }),
      ]);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async createAnswer({
    userId,
    questionId,
    ...createAnswerDto
  }: CreateAnswerDto): Promise<StatusResponse> {
    try {
      const [existingAnswer, question] = await Promise.all([
        this.findAnswerByUserIdAndActivatedDate({
          userId,
          activatedDate: moment().format(QUESTION_ACTIVATED_DATE_FORMAT),
        }),
        this.questionService.findQuestionById(questionId),
      ]);
      if (!question?.activated) throw 'Question is not activated.';
      if (existingAnswer) throw DEFAULT_EXCEPTION;
      const answer = await this.answerRepository.create({
        ...createAnswerDto,
        user: { id: userId },
        question: { id: questionId },
      });
      await this.answerRepository.save(answer);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async updateAnswer({
    answerId,
    userId,
    ...updateAnswerDto
  }: UpdateAnswerDto): Promise<StatusResponse> {
    try {
      await this.answerRepository.update(
        { id: answerId, user: { id: userId } },
        updateAnswerDto,
      );
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteAnswer({ id, userId }: IDeleteRequest): Promise<StatusResponse> {
    try {
      await this.answerRepository.delete({ id, user: { id: userId } });
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }
}
