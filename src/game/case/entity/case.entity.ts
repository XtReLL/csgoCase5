import { GameCase } from 'game/game/entity/game-case.entity';
import { LiveDrop } from 'live-drop/entity/live-drop.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CaseRarityType, CaseStatusType } from 'typings/graphql';
import { CaseItems } from './caseItems.entity';
import { CategoryCase } from './category_case.entity';

@Entity('case')
export class Case {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'double', default: 0.0 })
  price!: number;

  @Column({ default: CaseRarityType.CUSTOM })
  rarirty!: CaseRarityType;

  @Column({ default: CaseStatusType.ACTIVE })
  status!: CaseStatusType;

  @Column({ default: 0 })
  discount!: number;

  @Column({ nullable: true })
  icon!: string;

  @Column({ scale: 2, default: 0.0, type: 'decimal' })
  bank!: number;

  @Column({ default: 10 })
  bankPercent!: number;

  @Column({ scale: 2, default: 0.0, type: 'decimal' })
  profit!: number;

  @Column({ default: 0 })
  opened!: number;

  @OneToMany(() => CategoryCase, (categoryCase) => categoryCase.case)
  category!: Promise<CategoryCase[]>;

  @OneToMany(() => CaseItems, (caseItems) => caseItems.case)
  caseItems!: Promise<CaseItems[]>;

  @OneToMany(() => GameCase, (gameCase) => gameCase.case)
  gameCase!: Promise<GameCase[]>;

  @OneToMany(() => LiveDrop, (liveDrop) => liveDrop.case)
  liveDrop!: Promise<LiveDrop[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
