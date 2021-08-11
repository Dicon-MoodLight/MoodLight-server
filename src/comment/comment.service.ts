import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findCommentsByAnswerId(answerId): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { answer: answerId },
      order: { id: 'DESC' },
    });
  }
}
