import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { InventoryStatus } from 'typings/graphql';
import {
  AddItemToInventoryEvent,
  SellItemFromInventoryEvent,
} from './events/inventory.event';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryListener {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly inventoryService: InventoryService,
    @InjectRepository(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  @OnEvent('inventory.addItem')
  async addItem({
    user,
    item,
    inventory,
  }: AddItemToInventoryEvent): Promise<void> {
    this.redisCacheService.get(`inventory_${user.id}`);
  }

  @OnEvent('inventory.sellItem')
  async sellItem({ inventory }: SellItemFromInventoryEvent): Promise<void> {
    await this.inventoryRepository.update(inventory.id, {
      status: InventoryStatus.SOLD,
    });
  }
}
