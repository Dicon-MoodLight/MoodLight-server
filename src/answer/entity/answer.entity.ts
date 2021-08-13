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
  allow_comment: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
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
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
