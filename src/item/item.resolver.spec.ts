import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { User } from 'user/entity/user.entity';
import { Item } from './entity/item.entity';
import { ItemModule } from './item.module';
import { ItemResolver } from './item.resolver';
import { ItemService } from './item.service';

describe('ItemResolver', () => {
  let resolver: ItemResolver;
  let service: ItemService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Item]),
        ItemModule,
        CsgoMarketModule,
        HttpModule,
        RedisCacheModule,
      ],
      providers: [ItemResolver, ItemService],
    }).compile();

    resolver = module.get<ItemResolver>(ItemResolver);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
