import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entity/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findTodayQuestionByType(type: string): Promise<Question> {
    return await this.questionRepository.findOne({
      where: { type },
      order: { id: 'DESC' },
    });
  }
}
