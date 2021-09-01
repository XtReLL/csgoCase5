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
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
import { CaseModule } from './case.module';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { Category } from './entity/category.entity';
import { CategoryCase } from './entity/category_case.entity';
import { CaseFactory } from './factories/case.factory';
import { CaseItemsFactory } from './factories/caseItems.factory';
import { CategoryFactory } from './factories/category.factory';

describe('CaseResolver', () => {
  let service: CaseService;
  let resolver: CaseResolver;
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
      providers: [CaseService, CaseResolver],
    }).compile();

    service = module.get<CaseService>(CaseService);
    resolver = module.get<CaseResolver>(CaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('get case', () => {
    test('currect get cases', async () => {
      const user = await UserFactory().create();
      await CaseFactory().createList(10);

      const result = await resolver.cases(AuthorizedFactory(user));

      expect(result.data).toHaveLength(10);
    });

    test('currect get case', async () => {
      const user = await UserFactory().create();
      const [box, secondBox] = await CaseFactory().createList(2);

      const result = await resolver.case(AuthorizedFactory(user), `${box.id}`);
      expect(result.id).toEqual(box.id);
    });
  });

  describe('create case', () => {
    test('currect create case', async () => {
      const user = await UserFactory().create();
      const category = await CategoryFactory().create({ name: 'rar' });
      const box = await resolver.createCase(AuthorizedFactory(user, 'admin'), {
        bankPercent: 10,
        name: 'TestCase',
        price: 10,
        categories: [`${category.id}`],
      });
      const result = await resolver.case(AuthorizedFactory(user), `${box.id}`);
      expect(box.id).toEqual(result.id);
    });
  });

  describe('update case', () => {
    test('currect update case', async () => {
      const user = await UserFactory().create();
      const category = await CategoryFactory().create({ name: 'rar' });
      const box = await resolver.createCase(AuthorizedFactory(user, 'admin'), {
        bankPercent: 10,
        name: 'TestCase',
        price: 10,
        categories: [`${category.id}`],
      });
      const result = await resolver.updateCase(
        AuthorizedFactory(user, 'admin'),
        {
          id: `${box.id}`,
          price: 100,
        },
      );
      expect(result.price).toEqual(100);
    });
  });

  describe('remove case', () => {
    test('currect remove case', async () => {
      const user = await UserFactory().create();
      const category = await CategoryFactory().create({ name: 'rar' });
      const box = await resolver.createCase(AuthorizedFactory(user, 'admin'), {
        bankPercent: 10,
        name: 'TestCase',
        price: 10,
        categories: [`${category.id}`],
      });
      const result = await resolver.removeCase(
        AuthorizedFactory(user, 'admin'),
        `${box.id}`,
      );
      expect(result).toEqual(true);
    });
  });

  describe('add items in case', () => {
    test('currect add items in case', async () => {
      const user = await UserFactory().create();
      const category = await CategoryFactory().create({ name: 'rar' });
      const [firstItem, secondItem] = await ItemFactory().createList(2);
      const box = await resolver.createCase(AuthorizedFactory(user, 'admin'), {
        bankPercent: 10,
        name: 'TestCase',
        price: 10,
        categories: [`${category.id}`],
      });
      const result = await resolver.addItemsInCase(
        AuthorizedFactory(user, 'admin'),
        {
          itemsId: [`${firstItem.id}`, `${secondItem.id}`],
          caseId: `${box.id}`,
        },
      );

      expect(result).toHaveLength(2);
      expect(result[0].caseId).toEqual(box.id);
    });
  });

  describe('open case', () => {
    test('correct open case', async () => {
      jest.useFakeTimers();
      const user = await UserFactory().create({ balance: 1000000 });
      const category = await CategoryFactory().create({ name: 'rar' });
      const [firstItem, secondItem] = await ItemFactory().createList(2);

      const box = await resolver.createCase(AuthorizedFactory(user, 'admin'), {
        bankPercent: 10,
        name: 'TestCase',
        price: 10,
        categories: [`${category.id}`],
      });
      await CaseItemsFactory().create({ caseId: box.id, itemId: firstItem.id });
      await CaseItemsFactory().create({
        caseId: box.id,
        itemId: secondItem.id,
      });

      const result = await resolver.openCase(AuthorizedFactory(user), {
        id: `${box.id}`,
        count: 1,
      });

      expect(result).toHaveLength(1);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
