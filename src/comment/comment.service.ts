import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import { IStatusResponse } from "../types/response";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { throwHttpException } from "../util/error";
import { FAILURE_RESPONSE, SUCCESS_RESPONSE } from "../constants/response";

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

  async createComment({
    contents,
    answerId,
    userId,
  }: CreateCommentDto): Promise<IStatusResponse> {
    try {
      const comment = await this.commentRepository.create({
        contents,
        user: { id: userId },
        answer: { id: answerId },
      });
      await this.commentRepository.save(comment);
    } catch (err) {
      throwHttpException(FAILURE_RESPONSE, HttpStatus.CONFLICT);
    }
    return SUCCESS_RESPONSE;
  }
}
