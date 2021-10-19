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
import { LikeAnswer } from './like-answer.entity';

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
  question: Question;

  @OneToMany(() => Comment, (comment: Comment) => comment.answer, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => LikeAnswer, (likeAnswer: LikeAnswer) => likeAnswer.answer, {
    cascade: true,
  })
  likes: LikeAnswer[];

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '생성일' })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
