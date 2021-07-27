import { GameCase } from 'game/game/entity/game-case.entity';
import { GiveawayBet } from 'giveaway/entity/giveaway-bet.entity';
import { Giveaway } from 'giveaway/entity/giveaway.entity';
import { Inventory } from 'inventory/entity/inventory.entity';
import { Payment } from 'payment/entity/payment.entity';
import { PromocodeUse } from 'promocode/entity/promocode-use.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public username!: string;

  @Column({ nullable: true })
  steamId!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column('varchar', { nullable: true })
  trade_url!: string;

  @Column('double', { precision: 255, scale: 2, default: 0.0 })
  balance!: number;

  @OneToMany(() => PromocodeUse, (promocodeUse) => promocodeUse.user)
  usePromocodes!: Promise<PromocodeUse[]>;

  @OneToMany(() => GameCase, (gameCase) => gameCase.user)
  gameCase!: Promise<GameCase[]>;

  @OneToMany(() => Inventory, (inventory) => inventory.user)
  inventory!: Promise<Inventory[]>;

  @OneToMany(() => Giveaway, (giveaway) => giveaway.winner)
  giveaway!: Promise<Giveaway[]>;

  @OneToMany(() => GiveawayBet, (giveawayBet) => giveawayBet.user)
  giveawayBet!: Promise<GiveawayBet[]>;

  @OneToMany(() => Payment, (payment) => payment.user)
  payment!: Promise<Payment[]>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
