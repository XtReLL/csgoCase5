import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'item/entity/item.entity';

import { ItemModule } from 'item/item.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { InventoryStatus } from 'typings/graphql';
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { Inventory } from './entity/inventory.entity';
import { InventoryFactory } from './factories/inventory.factory';
import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';

describe('InventoryResolver', () => {
  let resolver: InventoryResolver;
  let module: TestingModule;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Inventory, Item]),
        ItemModule,
        RedisCacheModule,
        UserModule,
      ],
      providers: [InventoryResolver],
    }).compile();

    resolver = module.get<InventoryResolver>(InventoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('buy item', () => {
    // test('correct findAllItemsByUserId', async () => {
    //   const user = await UserFactory().create();
    //   await InventoryFactory().createList(5, {
    //     userId: user.id,
    //     itemId: 1,
    //   });
    //   const result = await service.findAllItemsByUserId(
    //     user.id,
    //     InventoryStatus.AVAILABLE,
    //   );
    //   expect(result).toHaveLength(5);
    //   expect(result[0].itemId).toEqual(1);
    //   expect(result[0].userId).toEqual(user.id);
    // });
  });

  afterAll(async () => {
    await module.close();
  });
});
