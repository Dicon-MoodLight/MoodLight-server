import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';
import { Repository } from 'typeorm';
import { IStatusResponse } from '../types/response';
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from '../constants/response';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { throwHttpException } from '../util/error';
import { QuestionService } from '../question/question.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly questionService: QuestionService,
  ) {}

  async findAnswerById(id: number): Promise<Answer> {
    return await this.answerRepository.findOne({ id });
  }

  async findAnswersByQuestionId(
    questionId: string,
    skip: number,
    take: number,
  ): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { question: questionId, private: false },
      order: { id: 'DESC' },
      skip,
      take,
    });
  }

  async createAnswer({
    userId,
    questionId,
    ...createAnswerDto
  }: CreateAnswerDto): Promise<IStatusResponse> {
    try {
      const question = await this.questionService.findQuestionById(questionId);
      if (!question.activated) {
        throwHttpException(
          { ...FAILURE_RESPONSE, message: 'Question is not activated.' },
          HttpStatus.CONFLICT,
        );
      }
      const answer = await this.answerRepository.create({
        ...createAnswerDto,
        user: { id: userId },
        question: { id: questionId },
      });
      await this.answerRepository.save(answer);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }
}
