import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { Answer } from './entity/answer.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { IStatusResponse } from '../types/response';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly answerService: AnswerService,
  ) {}

  @ApiOperation({ summary: '답변 리스트 가져오기 (최신순)' })
  @Get(':id')
  async findAnswers(
    @Param('id') id: string,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<Answer[]> {
    return await this.answerService.findAnswersByQuestionId(id, skip, take);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '자신의 답변 리스트 가져오기 (최신순)' })
  @Get('my')
  async findMyAnswers(@Req() req: any): Promise<Answer[]> {
    const { id } = req.user;
    return await this.answerRepository.find({
      where: { user: { id } },
      order: { id: 'DESC' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '답변 생성하기' })
  @Post()
  async createAnswer(
    @Req() req: any,
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.answerService.createAnswer({
      ...createAnswerDto,
      userId,
    });
  }
}
