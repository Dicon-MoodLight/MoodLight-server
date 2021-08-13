import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { IStatusResponse } from '../types/response';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ summary: '답변 리스트 가져오기 (최신순)' })
  @Get(':id')
  async findAnswers(@Param('id') id: string): Promise<Answer[]> {
    return await this.answerService.findAnswersByQuestionId(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '답변 생성하기' })
  @Post()
  async createAnswer(
    @Req() req: any,
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<IStatusResponse> {
    const userId = req.user?.id;
    return await this.answerService.createAnswer({
      ...createAnswerDto,
      userId,
    });
  }
}
