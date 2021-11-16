import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from '../../user/entity/user.entity';

@Entity('answer_likes')
export class AnswerLike extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Answer, (answer: Answer) => answer.answerLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  @ManyToOne(() => User, (user: User) => user.answerLikes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ nullable: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
