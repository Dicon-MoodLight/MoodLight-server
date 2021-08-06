import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../../answer/entity/answer.entity';
import { IType } from '../types/question';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  selected: boolean;

  @Column({ length: 10, nullable: false })
  type: IType;

  @Column({ length: 150, nullable: false })
  contents: string;

  @Column({ type: 'boolean', nullable: false, default: false, select: false })
  activated: boolean;

  @Column({ length: '8', nullable: true, select: false })
  activatedDate: string;

  @OneToMany(() => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @CreateDateColumn({ name: 'createdDate', nullable: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', nullable: false, select: false })
  updatedDate: Date;
}
