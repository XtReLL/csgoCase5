import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  siteName!: string;

  @Column({ type: 'double', default: 73.62 })
  dollarRate!: number;

  @Column({ default: 0 })
  minSteamLvlForUsePromocode!: number;

  @Column({ default: 0 })
  minPlayTimeInCSGOForUsePromocode!: number;

  @Column({ default: 0 })
  minItemPrice!: number;

  @Column({ default: 0.5, type: 'double' })
  minPayment!: number;

  @Column({ default: 15000, type: 'double' })
  maxPayment!: number;

  @Column({ default: 0.25, type: 'double' })
  minPaymentToPromocode!: number;

  @Column({ default: 1.5, type: 'double' })
  maxBuyPercent!: number;

  @Column({ nullable: true })
  freekassaId!: number;

  @Column({ nullable: true })
  freekassaSecret1!: string;

  @Column({ nullable: true })
  freekassaSecret2!: string;

  @Column({ nullable: true })
  coinbaseApiKey!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
