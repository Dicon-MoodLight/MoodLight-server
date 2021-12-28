import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';
import { StatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { FindListDto, CountDto } from '../utils/dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':answerId')
  async findComments(
    @Req() req: any,
    @Param('answerId', ParseIntPipe) answerId: number,
    @Query() { start, take }: FindListDto,
  ): Promise<Comment[]> {
    const { id: userId } = req.user;
    return await this.commentService.findComments({
      answerId,
      userId,
      start,
      take,
    });
  }

  @Get('count/:answerId')
  async getCount(
    @Param('answerId', ParseIntPipe) answerId: number,
  ): Promise<CountDto> {
    const count = await this.commentService.getCountByAnswerId(answerId);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.commentService.createComment({
      ...createCommentDto,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateComment(
    @Req() req: any,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.commentService.updateComment({
      ...updateCommentDto,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatusResponse> {
    const { id: userId } = req.user;
    return await this.commentService.deleteComment({ id, userId });
  }
}
