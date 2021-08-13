import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { IType } from './types/question';

interface IFindQuestion {
  type: IType;
  activatedDate: string;
}

const TYPE_ARRAY: IType[] = ['sad', 'happy', 'angry'];

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  private activateQuestionTemplate(
    type,
    activated,
  ): () => Promise<UpdateResult> {
    return async () => {
      const id = (
        await this.questionRepository.findOne({
          where: { type, activated },
          select: ['id'],
          ...(activated ? { order: { id: 'DESC' } } : {}),
        })
      )?.id;
      const activatedDate = moment().format('YYYY-MM-DD');
      return await this.questionRepository.update(id, {
        activated: !activated,
        activatedDate,
      });
    };
  }

  @Cron('000 * * *')
  async updateTodayQuestion() {
    setTimeout(async () => {
      const promises = TYPE_ARRAY.map(async (type) => {
        await Promise.all([
          this.activateQuestionTemplate(type, true),
          this.activateQuestionTemplate(type, false),
        ]);
      });
      await Promise.all(promises);
    }, 1000);
  }

  async findQuestionById(id: string): Promise<Question> {
    return await this.questionRepository.findOne({ id });
  }

  async findQuestion({
    type,
    activatedDate,
  }: IFindQuestion): Promise<Question> {
    return await this.questionRepository.findOne({
      type,
      activatedDate,
      activated: true,
    });
  }
}
