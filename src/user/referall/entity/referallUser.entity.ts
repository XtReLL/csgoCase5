import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from 'user/user/entity/user.entity';
import { ReferallCode } from './referallCode.entity';

@Entity('referall_user')
export class ReferallUser {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  codeId!: number;

  @Column()
  referallId!: number;

  @ManyToOne(() => User, (user) => user.refer)
  referall!: Promise<User>;

  @ManyToOne(() => ReferallCode, (referallCode) => referallCode.referall)
  code!: Promise<ReferallCode>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
