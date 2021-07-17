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

  @Column()
  category!: string;

  @Column({ default: CaseStatusType.ACTIVE })
  status!: CaseStatusType;

  @Column({ default: 0 })
  discount!: number;

  @Column({ nullable: true })
  icon!: string;

  @OneToMany(() => CaseItems, (caseItems) => caseItems.case)
  caseItems!: Promise<CaseItems[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
