import { GameCase } from 'game/game/entity/game-case.entity';
import { GiveawayBet } from 'giveaway/entity/giveaway-bet.entity';
import { Giveaway } from 'giveaway/entity/giveaway.entity';
import { Inventory } from 'inventory/entity/inventory.entity';
import { LiveDrop } from 'live-drop/entity/live-drop.entity';
import { Payment } from 'payment/entity/payment.entity';
import { PromocodeUse } from 'promocode/entity/promocode-use.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ReferallCode } from 'user/referall/entity/referallCode.entity';
import { ReferallUser } from 'user/referall/entity/referallUser.entity';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';

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

  @Column({ scale: 2, default: 0, type: 'decimal' })
  profit!: number;

  @Column({ default: 0 })
  opened!: number;

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

  @OneToMany(() => WithdrawItem, (withdrawItem) => withdrawItem.user)
  withdrawItem!: Promise<WithdrawItem[]>;

  @OneToMany(() => LiveDrop, (liveDrop) => liveDrop.user)
  liveDrop!: Promise<LiveDrop[]>;

  @OneToMany(() => ReferallUser, (referallUser) => referallUser.referall)
  refer!: Promise<ReferallUser[]>;

  @OneToOne(() => ReferallCode, (referallCode) => referallCode.user)
  referallCode!: Promise<ReferallCode>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
