import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { Item } from 'item/entity/item.entity';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Connection, Repository } from 'typeorm';
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
    @InjectConnection() private readonly connection: Connection,
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
    status?: InventoryStatus,
  ): Promise<[Inventory[], number]> {
    const inventory = await this.redisCacheService.get(`inventory_${userId}`);

    if (inventory) {
      return inventory;
    }

    const query = this.inventoryRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId });

    if (status === InventoryStatus.AVAILABLE) {
      query.andWhere('status = :status', { status: InventoryStatus.AVAILABLE });
    }

    const result = query.getManyAndCount();
    await this.redisCacheService.set(`inventory_${userId}`, result);

    return result;
  }

  async list(
    userId: number,
    pagination: Pagination = defaultPagination,
  ): Promise<[Inventory[], number]> {
    const query = await paramsToBuilder(
      this.inventoryRepository.createQueryBuilder(),
      pagination,
    );
    query.andWhere('userId = :userId', { userId });
    const result = query.getManyAndCount();

    return result;
  }

  async withdrawItem(user: User, inventoryItem: Inventory) {
    const withdraw = await this.withdrawItemRepository.save(
      this.withdrawItemRepository.create({
        userId: user.id,
        itemId: inventoryItem.itemId,
      }),
    );
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

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

      await this.removeItems([inventoryItem.id]);
      queryRunner.commitTransaction();
      return true;
    } catch (e) {
      queryRunner.rollbackTransaction();
      throw e;
    } finally {
      queryRunner.release();
    }
  }

  async removeItems(inventoryIds: number[]): Promise<boolean> {
    const builder = this.inventoryRepository.createQueryBuilder().delete();

    builder.where('id IN (:...inventoryIds)', { inventoryIds });
    await builder.execute();
    return true;
  }

  async sellItem(itemIds: number[], author: User): Promise<boolean> {
    if (await this.redisCacheService.get(`sell_item_${author.id}`)) {
      throw 'Please, wait a bit and try again';
    }

    await this.redisCacheService.set(`sell_item_${author.id}`, 1, {
      ttl: 5,
    });
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const builder = this.inventoryRepository.createQueryBuilder();
      builder.where('id IN (:...itemIds)', { itemIds });
      builder.andWhere('userId = :userId', { userId: author.id });
      const inventories = await builder.getMany();

      await Promise.all(
        inventories.map((inventory) => {
          author.balance += inventory.price;
        }),
      );

      await this.userService.update(author);

      await this.removeItems(itemIds);

      queryRunner.commitTransaction();
      return true;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }
}
