import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';

import { Item } from 'item/entity/item.entity';
import { ItemFactory } from 'item/factories/item.factory';

import { ItemModule } from 'item/item.module';

import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { InventoryStatus } from 'typings/graphql';
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
import { Inventory } from './entity/inventory.entity';
import { InventoryFactory } from './factories/inventory.factory';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let module: TestingModule;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Inventory, Item, WithdrawItem]),
        ItemModule,
        RedisCacheModule,
        UserModule,
        CsgoMarketModule,
      ],
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get items', () => {
    test('correct findAllItemsByUserId', async () => {
      const user = await UserFactory().create();
      const randomItem = await ItemFactory().create();
      await InventoryFactory().createList(5, {
        userId: user.id,
        itemId: randomItem.id,
      });
      const result = await service.findAllItemsByUserId(
        user.id,
        InventoryStatus.AVAILABLE,
      );
      expect(result[1]).toEqual(5);
      expect(result[0][0].itemId).toEqual(randomItem.id);
      expect(result[0][0].userId).toEqual(user.id);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
