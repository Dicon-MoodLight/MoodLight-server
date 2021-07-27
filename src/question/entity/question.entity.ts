import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  selected: boolean;

  @Column({ length: 30, nullable: false })
  type: string;

  @Column({ length: 150, nullable: false })
  contents: string;

  @OneToMany((type) => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @CreateDateColumn({ name: 'createdDate', nullable: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', nullable: false, select: false })
  updatedDate: Date;
}
