import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from '../../user/entity/user.entity';

@Entity('likeAnswer')
export class LikeAnswer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Answer, (answer: Answer) => answer.likes, {
    onDelete: 'CASCADE',
  })
  answer: Answer;

  @ManyToOne(() => User, (user: User) => user.likeAnswers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ nullable: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
