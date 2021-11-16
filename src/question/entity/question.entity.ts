import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Mood } from '../types/question';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '질문 아이디' })
  id: string;

  @Column({ length: 5, nullable: false })
  @ApiProperty({ description: '기분' })
  mood: Mood;

  @Column({ length: 150, nullable: false })
  @ApiProperty({ description: '질문 텍스트' })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  @ApiProperty({ description: '오늘의 질문 채택 여부' })
  activated: boolean;

  @Column({
    name: 'activated_date',
    length: 10,
    nullable: false,
  })
  @ApiProperty({ description: '오늘의 질문 채택 날짜' })
  activatedDate: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  @JoinTable()
  answers: Answer[];

  @CreateDateColumn({ name: 'created_date', nullable: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', nullable: false, select: false })
  updatedDate: Date;
}
