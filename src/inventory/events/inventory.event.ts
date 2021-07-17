import { Inventory } from 'inventory/entity/inventory.entity';
import { Item } from 'item/entity/item.entity';
import { User } from 'user/entity/user.entity';

export class AddItemToInventoryEvent {
  constructor(
    public item: Item,
    public user: User,
    public inventory: Inventory,
  ) {}
}
