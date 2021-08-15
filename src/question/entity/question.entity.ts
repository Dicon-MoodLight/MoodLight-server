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

  @Column({ length: 150, nullable: false })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false, select: false })
  activated: boolean;

  @Column({ length: '8', nullable: true, select: false })
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
