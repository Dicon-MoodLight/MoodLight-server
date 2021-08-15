import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { Question } from './entity/question.entity';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: '질문 가져오기' })
  @Get()
  async findQuestion(@Query('date') activated_date: string): Promise<Question> {
    return await this.questionService.findQuestion(activated_date);
  }
}
