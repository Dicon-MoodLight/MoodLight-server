import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { AnswerLike } from '../../answer/entity/answer-like.entity';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_ENCRYPTED_PASSWORD_MAX_LENGTH,
  USER_FIREBASE_TOKEN_MAX_LENGTH,
  USER_NICKNAME_MAX_LENGTH,
} from '../../constants/length';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: USER_NICKNAME_MAX_LENGTH, nullable: false, unique: true })
  nickname: string;

  @Column({ length: USER_EMAIL_MAX_LENGTH, nullable: false, unique: true })
  email: string;

  @Column({
    length: USER_ENCRYPTED_PASSWORD_MAX_LENGTH,
    nullable: false,
    select: false,
  })
  password: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.user, {
    cascade: true,
  })
  answers: Answer[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => AnswerLike, (answerLike: AnswerLike) => answerLike.user, {
    cascade: true,
  })
  answerLikes: AnswerLike[];

  @Column({ type: 'boolean', nullable: false, default: false })
  is_admin: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  usePushMessageOnComment: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  usePushMessageOnLike: boolean;

  @Column({ length: USER_FIREBASE_TOKEN_MAX_LENGTH, nullable: true })
  firebaseToken: string;

  @CreateDateColumn({ nullable: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
