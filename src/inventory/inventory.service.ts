import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'item/entity/item.entity';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';
import { InventoryStatus } from 'typings/graphql';
import { UserService } from 'user/user.service';
import { AddItemToInventoryDto } from './dto/addItemToInventory.dto';
import { Inventory } from './entity/inventory.entity';
import { AddItemToInventoryEvent } from './events/inventory.event';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly redisCacheService: RedisCacheService,
    private eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  async addItems(
    addItemToInventoryDto: AddItemToInventoryDto,
  ): Promise<Inventory> {
    let inventoryItem = this.inventoryRepository.create({
      itemId: addItemToInventoryDto.itemId,
      userId: addItemToInventoryDto.userId,
      price: addItemToInventoryDto.price
        ? addItemToInventoryDto.price
        : (
            await this.itemRepository.findOneOrFail({
              where: { id: addItemToInventoryDto.itemId },
            })
          ).price,
    });

    const result = await this.inventoryRepository.save(inventoryItem);

    this.eventEmitter.emit(
      'inventory.addItem',
      new AddItemToInventoryEvent(
        await this.itemRepository.findOneOrFail(addItemToInventoryDto.itemId),
        await this.userService.findOne(addItemToInventoryDto.userId),
        result,
      ),
    );

    return result;
  }

  async findAllItemsByUserId(
    userId: number,
    status: InventoryStatus,
  ): Promise<Inventory[]> {
    const inventory = await this.redisCacheService.get(`inventory_${userId}`);

    if (inventory) {
      return inventory;
    }

    const result = await this.inventoryRepository.find({
      where: { userId: userId, status: status },
    });
    console.log(result);

    await this.redisCacheService.set(`inventory_${userId}`, result);

    return result;
  }
}
