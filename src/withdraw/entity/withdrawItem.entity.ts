import { Item } from 'item/entity/item.entity';
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
import { WithdrawStatusType } from 'typings/graphql';
import { User } from 'user/entity/user.entity';

@Entity('withdraw_item')
export class WithdrawItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  itemId!: number;

  @Column({ default: WithdrawStatusType.PENDING })
  status!: WithdrawStatusType;

  @Column({ default: null })
  customId!: string;

  @ManyToOne(() => User, (user) => user.withdrawItem, {
    onDelete: 'CASCADE',
  })
  user!: Promise<User>;

  @ManyToOne(() => Item, (item) => item.withdrawItem, {
    onDelete: 'CASCADE',
  })
  item!: Promise<Item>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
