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

@Entity('categories_case')
export class CategoryCase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  categoryId!: number;

  @Column()
  caseId!: number;

  @ManyToOne(() => Category, (category) => category.case)
  public category!: Promise<Category>;

  @ManyToOne(() => Case, (box) => box.category)
  public case!: Promise<Case>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
