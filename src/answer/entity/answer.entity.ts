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

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  allowComment: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  private: boolean;

  @ManyToOne((type) => User, (user: User) => user.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Question, (question: Question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @OneToMany((type) => Comment, (comment: Comment) => comment.answer, {
    cascade: true,
  })
  comments: Comment[];

  @CreateDateColumn({ name: 'createdDate', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', nullable: false, select: false })
  updatedDate: Date;
}
