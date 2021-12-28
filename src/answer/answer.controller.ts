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
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ExistResponse, StatusResponse } from '../types/response';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindListDto } from '../utils/dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CountOfAnswerResponseDto } from './dto/count-of-answer-response.dto';
import { QuestionIdDto } from '../question/dto';
import { AddAnswerLikeDto } from './dto/add-answer-like.dto';
import {
  AnswerIncludeIsLikeAndQuestionDto,
  AnswerIncludeIsLikeDto,
} from './dto/answer-include-is-like.dto';

@Controller('answer')
export class AnswerController {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly answerService: AnswerService,
  ) {}

  @Get('count/:activatedDate')
  async getCountOfAnswers(
    @Param('activatedDate') activatedDate: string,
  ): Promise<CountOfAnswerResponseDto[]> {
    return await this.answerService.getCountOfAnswers(activatedDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/all')
  async findAllMyAnswers(
    @Req() req: any,
  ): Promise<AnswerIncludeIsLikeAndQuestionDto[]> {
    const { id: userId } = req.user;
    const answers = await this.answerService.findAllMyAnswers(userId);
    return await this.answerService.answersIncludeIsLikePipeline<AnswerIncludeIsLikeAndQuestionDto>(
      { answers, userId },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/exist/:activatedDate')
  async getMyAnswerIsExist(
    @Req() req: any,
    @Param('activatedDate') activatedDate: string,
  ): Promise<ExistResponse> {
    const { id } = req.user;
    return {
      exist: !!(await this.answerService.findAnswerByUserIdAndActivatedDate({
        userId: id,
        activatedDate,
      })),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyAnswers(
    @Req() req: any,
    @Query() { start, take }: FindListDto,
  ): Promise<AnswerIncludeIsLikeAndQuestionDto[]> {
    const { id: userId } = req.user;
    const answers = await this.answerService.findMyAnswers({
      userId,
      start,
      take,
    });
    return await this.answerService.answersIncludeIsLikePipeline<AnswerIncludeIsLikeAndQuestionDto>(
      { answers, userId },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  async findAnswers(
    @Req() req: any,
    @Param() { questionId }: QuestionIdDto,
    @Query() { start, take }: FindListDto,
  ): Promise<AnswerIncludeIsLikeDto[]> {
    const { id: userId } = req.user;
    const answers = await this.answerService.findAnswers({
      questionId,
      userId,
      start,
      take,
    });
    return await this.answerService.answersIncludeIsLikePipeline<AnswerIncludeIsLikeDto>(
      { answers, userId },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('like/:isLike')
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

  @UseGuards(JwtAuthGuard)
  @Delete(':answerId')
  async deleteAnswer(
    @Req() req: any,
    @Param('answerId', ParseIntPipe) answerId: number,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.deleteAnswer({ id: answerId, userId });
  }
}
