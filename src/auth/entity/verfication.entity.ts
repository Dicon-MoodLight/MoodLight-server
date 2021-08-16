import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

type IVerificationMode = 'join' | 'change_password';

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 320, nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  user: string;

  @Column({ length: '15', nullable: false })
  mode: IVerificationMode;

  @Column({ length: 6, nullable: true, select: false })
  confirmCode: string;

  @CreateDateColumn({ nullable: false, select: false })
  created_date: Date;

  @UpdateDateColumn({ nullable: false, select: false })
  updated_date: Date;
}
