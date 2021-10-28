import { Repository, EntityRepository } from 'typeorm';
import { Inventory } from './entity/inventory.entity';

@EntityRepository(Inventory)
export class InventoryRepository extends Repository<Inventory> {}
