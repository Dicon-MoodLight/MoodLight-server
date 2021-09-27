import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Mood } from '../types/question';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '질문 아이디' })
  id: string;

  @Column({ length: 5, nullable: false })
  @ApiProperty({ description: '기분' })
  mood: Mood;

  @Column({ length: 150, nullable: false })
  @ApiProperty({ description: '질문 텍스트' })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false, select: false })
  @ApiProperty({ description: '오늘의 질문 채택 여부' })
  activated: boolean;

  @Column({ length: '8', nullable: true, select: false })
  @ApiProperty({ description: '오늘의 질문 채택 날짜' })
  activated_date: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @CreateDateColumn({ name: 'createdDate', nullable: false, select: false })
  created_date: Date;

  @UpdateDateColumn({ name: 'updatedDate', nullable: false, select: false })
  updated_date: Date;
}
