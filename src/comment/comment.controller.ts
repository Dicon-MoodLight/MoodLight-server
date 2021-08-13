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
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';
import { IStatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 리스트 가져오기 (최신순)' })
  @Get(':id')
  async findComments(
    @Req() req: any,
    @Param('id') answerId: string,
  ): Promise<Comment[]> {
    const userId = req.user?.id;
    return await this.commentService.findCommentsByAnswerId(answerId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 생성하기' })
  @Post()
  async createComment(
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<IStatusResponse> {
    const userId = req.user?.id;
    return await this.commentService.createComment({
      ...createCommentDto,
      userId,
    });
  }
}
