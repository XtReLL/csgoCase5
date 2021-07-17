import { Item } from 'item/entity/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CaseRarityType, CaseStatusType } from 'typings/graphql';
import { Case } from './case.entity';

@Entity('case_items')
export class CaseItems {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  caseId!: number;

  @Column()
  itemId!: number;

  @ManyToOne(() => Case, (case1) => case1.caseItems)
  public case!: Promise<Case>;

  @ManyToOne(() => Item, (item) => item.caseItems)
  public item!: Promise<Item>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
