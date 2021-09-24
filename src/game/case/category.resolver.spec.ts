import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { BackpackApiModule } from 'backpack-api/backpack-api.module';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { GameModule } from 'game/game/game.module';
import { InventoryModule } from 'inventory/inventory.module';
import { ItemFactory } from 'item/factories/item.factory';
import { LiveDropModule } from 'live-drop/live-drop.module';
import { PaybackSystemModule } from 'payback-system/payback-system.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { getManager } from 'typeorm';
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
import { CaseModule } from './case.module';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { Category } from './entity/category.entity';
import { CategoryCase } from './entity/category_case.entity';
import { CaseFactory } from './factories/case.factory';
import { CaseItemsFactory } from './factories/caseItems.factory';
import { CategoryFactory } from './factories/category.factory';

describe('CaseResolver', () => {
  let service: CategoryService;
  let caseResolver: CaseResolver;
  let resolver: CategoryResolver;
  let module: TestingModule;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([
          Case,
          CaseItems,
          CategoryCase,
          WithdrawItem,
          Category,
        ]),
        CaseModule,
        UserModule,
        GameModule,
        RedisCacheModule,
        PaybackSystemModule,
        LiveDropModule,
        InventoryModule,
        CsgoMarketModule,
      ],
      providers: [CategoryService, CategoryResolver],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    caseResolver = module.get<CaseResolver>(CaseResolver);
    resolver = module.get<CategoryResolver>(CategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('get category', () => {
    test('currect get categories', async () => {
      getManager().getRepository(Category).softDelete({});
      const user = await UserFactory().create();
      await CategoryFactory().createList(6);

      const result = await resolver.caseCategories();

      expect(result.data).toHaveLength(6);
    });

    test('currect get case category', async () => {
      const user = await UserFactory().create();
      const category = await CategoryFactory().create({
        name: 'testCategoryName',
      });

      const result = await resolver.caseCategory(`${category.id}`);
      expect(result.id).toEqual(category.id);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
