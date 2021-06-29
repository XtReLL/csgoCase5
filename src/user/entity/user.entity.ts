import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    public username!: string

    @Column()
    steamId!: string

    @Column()
    avatar!: string

    @Column('varchar', { default: null })
    trade_url!: string

    @Column('double', { precision: 255, scale: 2, default: 0.00 })
    balance!: number

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}
