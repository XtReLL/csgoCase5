import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromocodeUse } from './promocode-use.entity';

@Entity('promocodes')
export class Promocode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ precision: 255, scale: 2, nullable: true, type: 'double' })
  sum!: number | null;

  @Column({ nullable: true, type: 'int' })
  percent!: number | null;

  @Column({ nullable: true })
  count!: number;

  @Column({ nullable: true })
  endTime!: Date;

  @Column({ default: false })
  onMainPage!: boolean;

  @OneToMany(() => PromocodeUse, (promocodeUse) => promocodeUse.promocode)
  usePromocodes!: Promise<PromocodeUse[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
