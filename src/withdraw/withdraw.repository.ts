import { Repository, EntityRepository } from 'typeorm';
import { WithdrawItem } from './entity/withdrawItem.entity';

@EntityRepository(WithdrawItem)
export class WithdrawRepository extends Repository<WithdrawItem> {}
