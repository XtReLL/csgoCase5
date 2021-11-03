import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethodType, PaymentStatusType } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  paymentId!: string;

  @Column()
  userId!: number;

  @Column({ default: 0.0, type: 'double' })
  sum!: number;

  @Column({ default: PaymentStatusType.PENDING })
  status!: PaymentStatusType;

  @Column({ default: PaymentMethodType.NONE })
  method!: PaymentMethodType;

  @ManyToOne(() => User, (user) => user.payment, {
    onDelete: 'CASCADE',
  })
  user!: Promise<User>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
