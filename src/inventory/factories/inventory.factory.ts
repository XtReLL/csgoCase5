import { Inventory } from 'inventory/entity/inventory.entity';
import { Factory } from 'typeorm-factory';
import { InventoryStatus } from 'typings/graphql';

export const InventoryFactory = () =>
  new Factory(Inventory)
    .attr('price', 0)
    .attr('status', InventoryStatus.AVAILABLE);
