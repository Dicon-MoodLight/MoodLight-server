import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Answer } from '../../answer/entity/answer.entity';
import { COMMENT_CONTENTS_MAX_LENGTH } from '../../constants/length';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    length: COMMENT_CONTENTS_MAX_LENGTH,
    nullable: false,
  })
  contents: string;

  @ManyToOne(() => Answer, (answer: Answer) => answer.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answerId' })
  answer: Answer;

  @ManyToOne(() => User, (user: User) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ nullable: false, select: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
