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
import { AnswerLike } from './answer-like.entity';

@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  private: boolean;

  @Column({ name: 'mood_level', type: 'int', nullable: false })
  moodLevel: number;

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
  countOfComment: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;

  @OneToMany(() => AnswerLike, (answerLike: AnswerLike) => answerLike.answer, {
    cascade: true,
  })
  answerLikes: AnswerLike[];

  @CreateDateColumn({ name: 'created_date', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', nullable: false, select: false })
  updatedDate: Date;
}
