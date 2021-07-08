import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { UserFactory } from 'user/factories/user.factory';
import { Item } from './entity/item.entity';
import { ItemModule } from './item.module';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let module: TestingModule;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Item]),
        ItemModule,
        CsgoMarketModule,
        HttpModule,
        RedisCacheModule,
      ],
      providers: [ItemService, CsgoMarketService],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parse items', () => {
    test('correct loadItems', async () => {
      const user = await UserFactory().create();
      const items = await service.loadItems();

      expect(items).toEqual(true);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
