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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { Question } from './entity/question.entity';
import { StatusResponse } from '../types/response';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { StatusResponseDto } from '../constants/response';
import { NOT_ADMIN_EXCEPTION } from '../constants/exception';
import { Mood, moodList } from './types/question';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { QUESTION_ACTIVATED_DATE_FORMAT } from '../constants/format';
import { QuestionIdDto } from './dto/question-id.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: '질문 가져오기',
    description: '오늘의 질문들을 가져오려면 date 에 today 를 대신 입력하세요.',
  })
  @ApiResponse({ status: 200, type: Question, isArray: true })
  @ApiImplicitQuery({
    name: 'date',
    required: true,
    description: `활성화 날짜 (${QUESTION_ACTIVATED_DATE_FORMAT})`,
  })
  @ApiImplicitQuery({
    name: 'mood',
    required: false,
    description: `기분 [${moodList}]`,
  })
  @Get()
  async findQuestions(
    @Query('date') activatedDate: string,
    @Query('mood') mood?: Mood,
  ): Promise<Question[]> {
    return await this.questionService.findQuestions(activatedDate, mood);
  }

  @ApiOperation({
    summary: '질문 등록하기',
    description:
      '질문을 등록하면 지정한 활성화 날짜에 오늘의 질문로 활성화됩니다.',
  })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiBody({ type: CreateQuestionDto })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: '질문 수정하기' })
  @ApiBearerAuth()
  @ApiResponse({ type: StatusResponseDto })
  @ApiBody({ type: UpdateQuestionDto })
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

  @ApiOperation({ summary: '질문 삭제하기' })
  @ApiBearerAuth()
  @ApiResponse({ type: StatusResponseDto })
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
