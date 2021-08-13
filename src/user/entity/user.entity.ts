import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';
import { Comment } from '../../comment/entity/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 13, nullable: false, unique: true })
  nickname: string;

  @Column({ length: 320, nullable: false, unique: true })
  email: string;

  @Column({ length: 24, nullable: false, select: false })
  password: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.user, {
    cascade: true,
  })
  answers: Answer[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];

  @Column({ type: 'boolean', nullable: false, default: false })
  is_admin: boolean;

  @Column({ length: 6, nullable: true, select: false })
  confirmCode: string;

  @Column({ type: 'boolean', nullable: false, default: false, select: false })
  confirmed: boolean;

  @CreateDateColumn({ nullable: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
