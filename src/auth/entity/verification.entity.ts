import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

type IVerificationMode = 'join' | 'change_password';

@Entity('verifications')
export class Verification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 320, nullable: false, unique: true, select: true })
  email: string;

  @Column({ length: 13, nullable: true, unique: true, select: true })
  nickname: string;

  @Column({ type: 'text', nullable: true, select: true })
  user: string;

  @Column({ length: '15', nullable: false, default: 'join', select: true })
  mode: IVerificationMode;

  @Column({ length: 6, nullable: true, select: false })
  confirmCode: string;

  @CreateDateColumn({ nullable: false, select: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
