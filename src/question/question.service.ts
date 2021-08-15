import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  private activateQuestionTemplate(activated): () => Promise<UpdateResult> {
    return async () => {
      const id = (
        await this.questionRepository.findOne({
          where: { activated },
          select: ['id'],
          ...(activated ? { order: { id: 'DESC' } } : {}),
        })
      )?.id;
      const activated_date = moment().format('YYYY-MM-DD');
      return await this.questionRepository.update(id, {
        activated: !activated,
        activated_date,
      });
    };
  }

  @Cron('000 * * *')
  async updateTodayQuestion() {
    setTimeout(async () => {
      await Promise.all([
        this.activateQuestionTemplate(true),
        this.activateQuestionTemplate(false),
      ]);
    }, 1000);
  }

  async findQuestionById(id: string): Promise<Question> {
    return await this.questionRepository.findOne({ id });
  }

  async findQuestion(activated_date): Promise<Question> {
    return await this.questionRepository.findOne({
      activated_date,
      activated: true,
    });
  }
}
