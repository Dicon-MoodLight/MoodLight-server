import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';
import { IStatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindListDto } from '../util/dto/find-list.dto';
import { StatusResponseDto } from '../constants/response';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 리스트 가져오기 (최신순)' })
  @ApiResponse({ status: 200, type: Comment, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findComments(
    @Req() req: any,
    @Param('answerId') answerId: string,
    @Query() { skip, take }: FindListDto,
  ): Promise<Comment[]> {
    const { id: userId } = req.user;
    return await this.commentService.findComments({
      answerId,
      userId,
      skip,
      take,
    });
  }

  @ApiOperation({ summary: '댓글 생성하기' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.commentService.createComment({
      ...createCommentDto,
      userId,
    });
  }
}
