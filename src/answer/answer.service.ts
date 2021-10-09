import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';
import { Repository } from 'typeorm';
import { StatusResponse } from '../types/response';
import { SUCCESS_RESPONSE } from '../constants/response';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { QuestionService } from '../question/question.service';
import { exceptionHandler } from '../util/error';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { moodList } from '../question/types/question';
import { CountOfAnswerResponseDto } from './dto/count-of-answer-response.dto';
import { IDeleteRequest } from '../types/delete';

interface IFindAnswers {
  readonly questionId: string;
  readonly userId: any;
  readonly skip: number;
  readonly take: number;
}

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly questionService: QuestionService,
  ) {}

  async getCountOfAnswers(
    activated_date: string,
  ): Promise<CountOfAnswerResponseDto[]> {
    const countOfAnswers = [];
    await Promise.all(
      moodList.map((mood) => async () => {
        const count = await this.answerRepository.count({
          question: { mood, activated_date },
        });
        countOfAnswers.push({ mood, count });
      }),
    );
    return countOfAnswers;
  }

  async findAnswerById(id: number): Promise<Answer> {
    return await this.answerRepository.findOne({ id });
  }

  async findAnswers({
    questionId,
    userId,
    skip,
    take,
  }: IFindAnswers): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { question: questionId, private: false },
      order: { user: userId, id: 'DESC' },
      skip,
      take,
    });
  }

  async createAnswer({
    userId,
    questionId,
    ...createAnswerDto
  }: CreateAnswerDto): Promise<StatusResponse> {
    try {
      const question = await this.questionService.findQuestionById(questionId);
      if (!question.activated) {
        throw 'Question is not activated.';
      }
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
