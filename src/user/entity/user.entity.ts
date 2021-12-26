import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '사용자 아이디' })
  id: string;

  @Column({ length: USER_NICKNAME_MAX_LENGTH, nullable: false, unique: true })
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @Column({ length: USER_EMAIL_MAX_LENGTH, nullable: false, unique: true })
  @ApiProperty({ description: '이메일' })
  email: string;

  @Column({
    length: USER_ENCRYPTED_PASSWORD_MAX_LENGTH,
    nullable: false,
    select: false,
  })
  @ApiProperty({ description: '비밀번호' })
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
  @ApiProperty({ description: '관리자 여부' })
  is_admin: boolean;

  @Column({ length: USER_FIREBASE_TOKEN_MAX_LENGTH, nullable: true })
  @ApiProperty({ description: '파이어베이스 다바이스 토큰' })
  firebaseToken: string;

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '가입일' })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
