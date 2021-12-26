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

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '사용자 아이디' })
  id: string;

  @Column({ length: 13, nullable: false, unique: true })
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @Column({ length: 320, nullable: false, unique: true })
  @ApiProperty({ description: '이메일' })
  email: string;

  @Column({ length: 150, nullable: false, select: false })
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

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: '파이어베이스 다바이스 토큰' })
  firebaseToken: string;

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '가입일' })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
