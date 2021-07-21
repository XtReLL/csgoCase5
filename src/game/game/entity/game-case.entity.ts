import { Case } from 'game/case/entity/case.entity';
import { Item } from 'item/entity/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { CaseRarityType, CaseStatusType } from 'typings/graphql';
import { User } from 'user/entity/user.entity';

@Entity('game_case')
export class GameCase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  winningItemId!: number;

  @Column()
  caseId!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => Case, (box) => box.gameCase)
  public case!: Promise<Case>;

  @ManyToOne(() => User, (user) => user.gameCase)
  public user!: Promise<User>;

  @ManyToOne(() => Item, (item) => item.gameCase)
  public winningItem!: Promise<Item>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
