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
import { User } from 'user/entity/user.entity';
import { Giveaway } from './giveaway.entity';

@Entity('giveaway_bets')
export class GiveawayBet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  giveawayId!: number;

  @ManyToOne(() => User, (user) => user.giveawayBet)
  public user!: Promise<User>;

  @ManyToOne(() => Giveaway, (giveaway) => giveaway.giveawayBet)
  public giveaway!: Promise<Giveaway>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
