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

  @OneToMany((type) => Answer, (answer: Answer) => answer.user, {
    cascade: true,
  })
  answers: Answer[];

  @OneToMany((type) => Comment, (comment: Comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];

  @Column({ type: 'boolean', nullable: false, default: false })
  admin: boolean;

  @Column({ type: 'boolean', nullable: false, default: false, select: false })
  confirmed: boolean;

  @CreateDateColumn({ name: 'createdDate', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', nullable: false, select: false })
  updatedDate: Date;
}
