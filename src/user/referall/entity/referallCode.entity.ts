import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ReferallLevel } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { ReferallUser } from './referallUser.entity';

@Entity('referall_code')
export class ReferallCode {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  code!: string;

  @Column()
  userId!: number;

  @Column({ default: ReferallLevel.FIRST })
  level!: ReferallLevel;

  @OneToOne(() => User, (user) => user.referallCode)
  user!: Promise<User>;

  @OneToMany(() => ReferallUser, (referallUser) => referallUser.code)
  referall!: Promise<ReferallUser[]>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
