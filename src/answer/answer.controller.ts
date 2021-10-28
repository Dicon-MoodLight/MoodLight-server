import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
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
import { QuestionIdDto } from '../question/dto/question-id.dto';
import { AddAnswerLikeDto } from './dto/add-answer-like.dto';
import {
  AnswerIncludeIsLikeAndQuestionDto,
  AnswerIncludeIsLikeDto,
} from './dto/answer-include-is-like.dto';

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
    name: 'activatedDate',
    required: true,
    description: `활성화 날짜 (${QUESTION_ACTIVATED_DATE_FORMAT})`,
  })
  @Get('count/:activatedDate')
  async getCountOfAnswers(
    @Param('activatedDate') activatedDate: string,
  ): Promise<CountOfAnswerResponseDto[]> {
    return await this.answerService.getCountOfAnswers(activatedDate);
  }

  @ApiOperation({ summary: '자신의 답변 리스트 가져오기 (최신순)' })
  @ApiResponse({
    status: 200,
    type: AnswerIncludeIsLikeAndQuestionDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyAnswers(
    @Req() req: any,
    @Param() { questionId }: QuestionIdDto,
    @Query() { skip, take }: FindListDto,
  ): Promise<AnswerIncludeIsLikeAndQuestionDto[]> {
    const { id: userId } = req.user;
    const answers = await this.answerService.findMyAnswers({
      questionId,
      userId,
      skip,
      take,
    });
    return await this.answerService.answersIncludeIsLikePipeline<AnswerIncludeIsLikeAndQuestionDto>(
      { answers, userId },
    );
  }

  @ApiOperation({
    summary: '답변 리스트 가져오기 (최신순)',
    description: '다른 사용자의 답변도 포함됩니다.',
  })
  @ApiResponse({ status: 200, type: AnswerIncludeIsLikeDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  async findAnswers(
    @Req() req: any,
    @Param() { questionId }: QuestionIdDto,
    @Query() { skip, take }: FindListDto,
  ): Promise<AnswerIncludeIsLikeDto[]> {
    const { id: userId } = req.user;
    const answers = await this.answerService.findAnswers({
      questionId,
      userId,
      skip,
      take,
    });
    return await this.answerService.answersIncludeIsLikePipeline<AnswerIncludeIsLikeDto>(
      { answers, userId },
    );
  }

  @ApiOperation({ summary: '답변 좋아요 처리' })
  @ApiBody({ type: AddAnswerLikeDto })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiImplicitParam({
    name: 'isLike',
    required: true,
    description: `추가는 true, 취소는 false`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/like/:isLike')
  async processAnswerLike(
    @Req() req: any,
    @Body() { answerId }: AddAnswerLikeDto,
    @Param('isLike', ParseBoolPipe) isLike: boolean,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    if (isLike)
      return await this.answerService.addAnswerLike({ userId, answerId });
    return await this.answerService.removeAnswerLike({ userId, answerId });
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
  @ApiImplicitParam({
    name: 'answerId',
    required: true,
    description: '답변 id',
  })
  @Delete(':answerId')
  async deleteAnswer(
    @Req() req: any,
    @Param('answerId', ParseIntPipe) answerId: number,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.deleteAnswer({ id: answerId, userId });
  }
}
