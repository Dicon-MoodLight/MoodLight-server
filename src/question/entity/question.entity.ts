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
import { Mood } from '../types/question';
import { QUESTION_CONTENTS_MAX_LENGTH } from '../../constants/length';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 5, nullable: false })
  mood: Mood;

  @Column({ length: QUESTION_CONTENTS_MAX_LENGTH, nullable: false })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  activated: boolean;

  @Column({
    name: 'activated_date',
    length: 10,
    nullable: false,
  })
  activatedDate: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @CreateDateColumn({ name: 'created_date', nullable: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', nullable: false, select: false })
  updatedDate: Date;
}
