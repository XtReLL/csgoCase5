import { CaseItems } from 'game/case/entity/caseItems.entity';
import { GameCase } from 'game/game/entity/game-case.entity';
import { Inventory } from 'inventory/entity/inventory.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  market_hash_name!: string;

  @Column({ nullable: true, type: 'longtext' })
  icon_url!: string;

  @Column({ nullable: true })
  exterior!: string;

  @Column({ nullable: true })
  rarity!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ precision: 255, scale: 2, default: 0.0, type: 'double' })
  price!: number;

  @OneToMany(() => Inventory, (inventory) => inventory.item)
  inventory!: Promise<Inventory[]>;

  @OneToMany(() => GameCase, (gameCase) => gameCase.winningItem)
  gameCase!: Promise<GameCase[]>;

  @OneToMany(() => CaseItems, (caseItems) => caseItems.item)
  caseItems!: Promise<CaseItems[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
