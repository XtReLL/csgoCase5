import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'user/user/entity/user.entity';
import { Promocode } from './promocode.entity';

@Entity('promocode_uses')
export class PromocodeUse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  promocodeId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.usePromocodes)
  public user!: Promise<User>;

  @ManyToOne(() => Promocode, (promocode) => promocode.usePromocodes)
  public promocode!: Promise<Promocode>;
}
