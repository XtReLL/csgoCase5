import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('users_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  roleId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.userRole, {
    onDelete: 'CASCADE',
  })
  public user!: Promise<User>;

  @ManyToOne(() => Role, (role) => role.userRole, {
    onDelete: 'CASCADE',
  })
  public role!: Promise<Role>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
