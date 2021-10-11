import { CaseItems } from 'game/case/entity/caseItems.entity';
import { GameCase } from 'game/game/entity/game-case.entity';
import { Giveaway } from 'giveaway/entity/giveaway.entity';
import { Inventory } from 'inventory/entity/inventory.entity';
import { LiveDrop } from 'live-drop/entity/live-drop.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  marketHashName!: string;

  @Column({ nullable: true, type: 'longtext' })
  iconUrl!: string;

  @Column({ nullable: true })
  exterior!: string;

  @Column({ nullable: true })
  rarity!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  type!: string;

  @Column({ nullable: true })
  weaponType!: string;

  @Column({ nullable: true })
  gunType!: string;

  @Column({ precision: 255, scale: 2, default: 0.0, type: 'double' })
  price!: number;

  @OneToMany(() => Inventory, (inventory) => inventory.item)
  inventory!: Promise<Inventory[]>;

  @OneToMany(() => GameCase, (gameCase) => gameCase.winningItem)
  gameCase!: Promise<GameCase[]>;

  @OneToMany(() => CaseItems, (caseItems) => caseItems.item)
  caseItems!: Promise<CaseItems[]>;

  @OneToMany(() => Giveaway, (giveaway) => giveaway.item)
  giveaway!: Promise<Giveaway[]>;

  @OneToMany(() => WithdrawItem, (withdrawItem) => withdrawItem.item)
  withdrawItem!: Promise<WithdrawItem[]>;

  @OneToMany(() => LiveDrop, (liveDrop) => liveDrop.item)
  liveDrop!: Promise<LiveDrop[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
