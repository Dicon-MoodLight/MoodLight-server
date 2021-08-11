import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async findAnswersByQuestionId(questionId): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { question: questionId },
      order: { id: 'DESC' },
    });
  }
}
