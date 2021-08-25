import { Item } from 'item/entity/item.entity';
import { Factory } from 'typeorm-factory';

export const ItemFactory = () =>
  new Factory(Item).attr('price', 0).attr('market_hash_name', 'testItem');
