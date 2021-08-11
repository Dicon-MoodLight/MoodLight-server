import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ summary: '답변 리스트 가져오기 (최신순)' })
  @Get(':id')
  async findAnswers(@Param() id: string): Promise<Answer[]> {
    return await this.answerService.findAnswersByQuestionId(id);
  }
}
