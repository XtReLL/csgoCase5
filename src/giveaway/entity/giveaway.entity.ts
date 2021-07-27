import { Item } from 'item/entity/item.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'user/entity/user.entity';
import { GiveawayBet } from './giveaway-bet.entity';

@Entity('giveaway')
export class Giveaway {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  itemId!: number;

  @Column({ nullable: true })
  winnerId!: number;

  @Column()
  endDate!: Date;

  @ManyToOne(() => User, (user) => user.giveaway)
  public winner!: Promise<User>;

  @ManyToOne(() => Item, (item) => item.giveaway)
  public item!: Promise<Item>;

  @OneToMany(() => GiveawayBet, (giveawayBet) => giveawayBet.giveaway)
  giveawayBet!: Promise<GiveawayBet[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
