import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 리스트 가져오기 (최신순)' })
  @Get(':id')
  async findComments(@Param('id') id: string): Promise<Comment[]> {
    return await this.commentService.findCommentsByAnswerId(id);
  }
}
