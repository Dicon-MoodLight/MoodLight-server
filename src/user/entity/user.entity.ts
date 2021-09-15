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
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '사용자 아이디' })
  id: string;

  @Column({ length: 13, nullable: false, unique: true })
  @ApiProperty({ description: '닉네임' })
  nickname: string;

  @Column({ length: 320, nullable: false, unique: true })
  @ApiProperty({ description: '이메일' })
  email: string;

  @Column({ length: 24, nullable: false, select: false })
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

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({ description: '관리자 여부' })
  is_admin: boolean;

  @CreateDateColumn({ nullable: false })
  @ApiProperty({ description: '가입일' })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
