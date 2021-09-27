import {
  Body,
  Controller,
  Get,
  Post,
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

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: '질문 가져오기' })
  @ApiResponse({ status: 200, type: Question })
  @Get()
  async findQuestion(
    @Query('date') activated_date: string,
  ): Promise<Question[]> {
    return await this.questionService.findQuestionsByActivatedDate(
      activated_date,
    );
  }

  @ApiOperation({
    summary: '질문 등록하기',
    description:
      '질문을 등록하면 매일 자정에 등록된 순서대로 오늘의 질문이 변경됩니다.',
  })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiBody({ type: CreateQuestionDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(
    @Req() req: any,
    @Body() createQuestionDto: CreateQuestionDto[],
  ): Promise<StatusResponse> {
    const { is_admin } = req.user;
    if (!is_admin) {
      throw NOT_ADMIN_EXCEPTION;
    }
    return await this.questionService.createQuestion(createQuestionDto);
  }
}
