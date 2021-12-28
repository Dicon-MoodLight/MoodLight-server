import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entity/question.entity';
import { StatusResponse } from '../types/response';
import { CreateQuestionDto, QuestionIdDto, UpdateQuestionDto } from './dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { NOT_ADMIN_EXCEPTION } from '../constants/exception';
import { Mood } from './types/question';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async findQuestions(
    @Query('date') activatedDate?: string,
    @Query('mood') mood?: Mood,
  ): Promise<Question[]> {
    if (!activatedDate && !mood)
      return await this.questionService.getAllQuestions();
    return await this.questionService.findQuestions({ activatedDate, mood });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(
    @Req() req: any,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<StatusResponse> {
    const { is_admin } = req.user;
    if (!is_admin) {
      throw NOT_ADMIN_EXCEPTION;
    }
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateQuestion(
    @Req() req: any,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<StatusResponse> {
    const { is_admin } = req.user;
    if (!is_admin) {
      throw NOT_ADMIN_EXCEPTION;
    }
    return await this.questionService.updateQuestion(updateQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':questionId')
  async deleteQuestion(
    @Req() req: any,
    @Param() { questionId }: QuestionIdDto,
  ): Promise<StatusResponse> {
    const { is_admin } = req.user;
    if (!is_admin) {
      throw NOT_ADMIN_EXCEPTION;
    }
    return await this.questionService.deleteQuestion(questionId);
  }
}
