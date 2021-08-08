import { Case } from 'game/case/entity/case.entity';
import { Item } from 'item/entity/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LiveDropType } from 'typings/graphql';
import { User } from 'user/entity/user.entity';

@Entity('live_drop')
export class LiveDrop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ nullable: true })
  caseId!: number;

  @Column()
  itemId!: number;

  @Column({ scale: 2, default: 0.0, type: 'decimal' })
  price!: number;

  @Column({ nullable: true })
  tradeId!: string;

  @Column({ default: LiveDropType.CASE })
  type!: LiveDropType;

  @ManyToOne(() => User, (user) => user.liveDrop, {
    onDelete: 'CASCADE',
  })
  public user!: Promise<User>;

  @ManyToOne(() => Item, (item) => item.liveDrop, {
    onDelete: 'CASCADE',
  })
  public item!: Promise<Item>;

  @ManyToOne(() => Case, (box) => box.liveDrop, {
    onDelete: 'CASCADE',
  })
  public case!: Promise<Case>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
