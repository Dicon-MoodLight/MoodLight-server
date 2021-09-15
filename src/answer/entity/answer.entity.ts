import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Question } from '../../question/entity/question.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { IType } from '../../question/types/question';
import { ApiProperty } from '@nestjs/swagger';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '답변 아이디' })
  id: number;

  @Column({ length: 10, nullable: false })
  @ApiProperty({ description: '답변 카테고리' })
  type: IType;

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

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '생성일' })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
