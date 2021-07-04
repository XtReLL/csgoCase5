import { PromocodeUse } from 'promocode/entity/promocode-use.entity'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	public id!: number

	@Column()
	public username!: string

	@Column({nullable: true})
	steamId!: string

	@Column({nullable: true})
	avatar!: string

	@Column('varchar', { nullable: true })
	trade_url!: string

	@Column('double', { precision: 255, scale: 2, default: 0.00 })
	balance!: number

	@OneToMany(
		() => PromocodeUse,
		promocodeUse => promocodeUse.user,
	)
	usePromocodes!: Promise<PromocodeUse[]>;

	@CreateDateColumn()
	created_at!: Date

	@UpdateDateColumn()
	updated_at!: Date
}
