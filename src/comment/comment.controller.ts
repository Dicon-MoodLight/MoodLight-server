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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';
import { StatusResponse } from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindListDto } from '../util/dto/find-list.dto';
import { StatusResponseDto } from '../constants/response';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CountDto } from '../util/dto/count.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 리스트 가져오기 (최신순)' })
  @ApiResponse({ status: 200, type: Comment, isArray: true })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: '댓글 갯수 가져오기' })
  @Get('count/:answerId')
  async getCount(
    @Param('answerId', ParseIntPipe) answerId: number,
  ): Promise<CountDto> {
    const count = await this.commentService.getCountByAnswerId(answerId);
    return { count };
  }

  @ApiOperation({ summary: '댓글 생성하기' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: '댓글 수정하기' })
  @ApiCreatedResponse({ status: 201, type: StatusResponseDto })
  @ApiBody({ type: UpdateCommentDto })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: '댓글 삭제하기' })
  @ApiBearerAuth()
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
