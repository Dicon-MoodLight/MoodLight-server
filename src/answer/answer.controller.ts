import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
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
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { StatusResponse } from '../types/response';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindListDto } from '../util/dto/find-list.dto';
import { StatusResponseDto } from '../constants/response';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CountOfAnswerResponseDto } from './dto/count-of-answer-response.dto';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { QUESTION_ACTIVATED_DATE_FORMAT } from '../constants/format';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly answerService: AnswerService,
  ) {}

  @ApiOperation({ summary: '기분별 답변 개수 가져오기' })
  @ApiResponse({ status: 200, type: CountOfAnswerResponseDto, isArray: true })
  @ApiImplicitParam({
    name: 'activated_date',
    required: true,
    description: `활성화 날짜 (${QUESTION_ACTIVATED_DATE_FORMAT})`,
  })
  @Get('count/:activated_date')
  async getCountOfAnswers(
    @Param('activated_date') activated_date: string,
  ): Promise<CountOfAnswerResponseDto[]> {
    return await this.answerService.getCountOfAnswers(activated_date);
  }

  @ApiOperation({ summary: '자신의 답변 리스트 가져오기 (최신순)' })
  @ApiResponse({ status: 200, type: Answer, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyAnswers(@Req() req: any): Promise<Answer[]> {
    const { id } = req.user;
    return await this.answerRepository.find({
      where: { user: { id } },
      order: { id: 'DESC' },
    });
  }

  @ApiOperation({
    summary: '답변 리스트 가져오기 (최신순)',
    description: '다른 사용자의 답변도 포함됩니다.',
  })
  @ApiResponse({ status: 200, type: Answer, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findAnswers(
    @Req() req: any,
    @Param('questionId') questionId: string,
    @Query() { skip, take }: FindListDto,
  ): Promise<Answer[]> {
    const { id: userId } = req.user;
    return await this.answerService.findAnswers({
      questionId,
      userId,
      skip,
      take,
    });
  }

  @ApiOperation({ summary: '답변 생성하기' })
  @ApiBody({ type: CreateAnswerDto })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createAnswer(
    @Req() req: any,
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.createAnswer({
      ...createAnswerDto,
      userId,
    });
  }

  @ApiOperation({ summary: '답변 수정하기' })
  @ApiBody({ type: UpdateAnswerDto })
  @ApiBearerAuth()
  @ApiResponse({ type: StatusResponseDto })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateAnswer(
    @Req() req: any,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.updateAnswer({
      ...updateAnswerDto,
      userId,
    });
  }

  @ApiOperation({ summary: '답변 삭제하기' })
  @ApiBearerAuth()
  @ApiResponse({ type: StatusResponseDto })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAnswer(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.deleteAnswer({ id, userId });
  }
}
