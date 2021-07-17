import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { AddItemToInventoryEvent } from './events/inventory.event';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryListener {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly inventoryService: InventoryService,
  ) {}

  @OnEvent('inventory.addItem')
  async addItem({
    user,
    item,
    inventory,
  }: AddItemToInventoryEvent): Promise<void> {
    this.redisCacheService.get(`inventory_${user.id}`);
  }
}
