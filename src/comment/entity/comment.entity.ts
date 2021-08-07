import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Answer } from '../../answer/entity/answer.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  contents: string;

  @ManyToOne((type) => Answer, (answer: Answer) => answer.comments, {
    onDelete: 'CASCADE',
  })
  answer: Answer;

  @ManyToOne((type) => User, (user: User) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ nullable: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updatedDate: Date;
}
