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
import { Case } from './case.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('tags_case')
export class TagCase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tagId!: number;

  @Column()
  caseId!: number;

  @ManyToOne(() => Tag, (tag) => tag.case)
  public tag!: Promise<Category>;

  @ManyToOne(() => Case, (box) => box.tag)
  public case!: Promise<Case>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
