import { Item } from 'item/entity/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryStatus } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  itemId!: number;

  @Column({ precision: 255, scale: 2, default: 0.0, type: 'double' })
  price!: number;

  @Column({ default: InventoryStatus.AVAILABLE })
  status!: InventoryStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.inventory, {
    onDelete: 'CASCADE',
  })
  public user!: Promise<User>;

  @ManyToOne(() => Item, (item) => item.inventory, {
    onDelete: 'CASCADE',
  })
  public item!: Promise<Item>;
}
