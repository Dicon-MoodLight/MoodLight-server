import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Question } from '../../question/entity/question.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerLike } from './answer-like.entity';

@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '답변 아이디' })
  id: number;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: '답변 텍스트' })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({ description: '비공개 여부' })
  private: boolean;

  @ManyToOne(() => User, (user: User) => user.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Question, (question: Question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @OneToMany(() => Comment, (comment: Comment) => comment.answer, {
    cascade: true,
  })
  comments: Comment[];

  @Column({ type: 'int', nullable: false, default: 0 })
  @ApiProperty({ description: '댓글 갯수' })
  countOfComment: number;

  @ApiProperty({ description: '좋아요 갯수' })
  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;

  @OneToMany(() => AnswerLike, (answerLike: AnswerLike) => answerLike.answer, {
    cascade: true,
  })
  answerLikes: AnswerLike[];

  @CreateDateColumn({ name: 'created_date', nullable: false })
  @ApiProperty({ description: '생성일' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', nullable: false, select: false })
  updatedDate: Date;
}
