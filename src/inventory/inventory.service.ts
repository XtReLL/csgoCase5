import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { Item } from 'item/entity/item.entity';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';
import { InventoryStatus } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { UserService } from 'user/user/user.service';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
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
    @InjectRepository(WithdrawItem)
    private readonly withdrawItemRepository: Repository<WithdrawItem>,
    private readonly redisCacheService: RedisCacheService,
    private eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly csgoMarketService: CsgoMarketService,
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

  async withdrawItem(user: User, inventoryItem: Inventory) {
    const withdraw = await this.withdrawItemRepository.save(
      this.withdrawItemRepository.create({
        userId: user.id,
        itemId: inventoryItem.itemId,
      }),
    );

    try {
      const marketItem = await this.csgoMarketService.searchItemByHashName(
        await inventoryItem.item,
      );

      if (
        (await inventoryItem.item).price *
          (await this.redisCacheService.get('config')).maxBuyPercent <
        marketItem.price /
          100 /
          (await this.redisCacheService.get('config')).redisCacheServiceRate
      ) {
        throw new Error('High purchase prices');
      }

      const buyItem = await this.csgoMarketService.buyItem(marketItem, user);

      withdraw.customId = buyItem.custom_id;
      await this.withdrawItemRepository.save(withdraw);

      await this.removeItem(inventoryItem.id);

      return true;
    } catch (e) {
      throw e;
    }
  }

  async removeItem(inventoryId: number) {
    const inventoryItem = await this.inventoryRepository.findOneOrFail(
      inventoryId,
    );
    //
  }

  async sellItem(itemId: string, author: User): Promise<boolean> {
    if (
      typeof (await this.redisCacheService.get(`sell_item_${author.id}`)) !==
      'undefined'
    ) {
      throw 'Please, wait a bit and try again';
    }

    await this.redisCacheService.set(`sell_item_${author.id}`, 1, {
      ttl: 5,
    });

    const inventory = await this.inventoryRepository.findOneOrFail({
      where: { itemId: parseInt(itemId, 10), userId: author.id },
    });

    author.balance += inventory.price;

    await this.inventoryRepository.delete(inventory);

    return true;
  }
}
