import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { Question } from './entity/question.entity';
import { SUCCESS_RESPONSE } from '../constants/response';
import { StatusResponse } from '../types/response';
import { exceptionHandler } from '../utils/error';
import { Mood } from './types/question';
import { QUESTION_ACTIVATED_DATE_FORMAT } from '../constants/format';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

interface IFindQuestions {
  readonly activatedDate: string;
  readonly mood?: Mood;
}

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async updateTodayQuestion(): Promise<void> {
    const todayQuestions = await this.questionRepository.find({
      activated: false,
      activatedDate: moment().format(QUESTION_ACTIVATED_DATE_FORMAT),
    });
    for (const { id } of todayQuestions) {
      await this.questionRepository.update(id, {
        activated: true,
      });
    }
  }

  async updateYesterdayQuestion(): Promise<void> {
    const yesterdayQuestions = await this.questionRepository.find({
      activated: true,
      activatedDate: moment()
        .subtract(1, 'day')
        .subtract(1, 'day')
        .format(QUESTION_ACTIVATED_DATE_FORMAT),
    });
    for (const { id } of yesterdayQuestions) {
      await this.questionRepository.update(id, {
        activated: false,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul' })
  async activateQuestion() {
    setTimeout(async () => {
      await Promise.all([
        this.updateTodayQuestion,
        this.updateYesterdayQuestion,
      ]).then(() => {
        console.log(
          `[${moment().format('YYYY-MM-DD HH:MM:SS')}] Question updated...`,
        );
      });
    }, 1000);
  }

  async getAllQuestions(): Promise<Question[]> {
    const questions = await this.questionRepository.find({ activated: true });
    questions.sort(
      (first, second) =>
        +(first.activatedDate < second.activatedDate) -
        +(first.activatedDate > second.activatedDate),
    );
    return questions;
  }

  async findQuestionById(id: string): Promise<Question> {
    return await this.questionRepository.findOne({ id });
  }

  async findQuestions({
    activatedDate,
    mood,
  }: IFindQuestions): Promise<Question[]> {
    return await this.questionRepository.find({
      activatedDate:
        activatedDate === 'today'
          ? moment().format(QUESTION_ACTIVATED_DATE_FORMAT)
          : activatedDate,
      activated: true,
      ...(mood ? { mood } : {}),
    });
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<StatusResponse> {
    try {
      const newQuestion = await this.questionRepository.create({
        ...createQuestionDto,
        activated: true,
      });
      await this.questionRepository.save(newQuestion);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async updateQuestion({
    questionId,
    ...updateQuestionDto
  }: UpdateQuestionDto): Promise<StatusResponse> {
    try {
      await this.questionRepository.update(questionId, updateQuestionDto);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteQuestion(id: string): Promise<StatusResponse> {
    try {
      await this.questionRepository.delete(id);
    } catch (err) {
      exceptionHandler(err);
    }
    return SUCCESS_RESPONSE;
  }
}
