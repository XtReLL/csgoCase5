import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { CaseModule } from 'game/case/case.module';
import { CaseResolver } from 'game/case/case.resolver';
import { CaseService } from 'game/case/case.service';
import { CaseFactory } from 'game/case/factories/case.factory';
import { CaseItemsFactory } from 'game/case/factories/caseItems.factory';
import { CategoryFactory } from 'game/case/factories/category.factory';
import { ItemFactory } from 'item/factories/item.factory';
import { getTestModules } from 'testModules';
import { getConnection } from 'typeorm';
import { GiveawayType } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { UserFactory } from 'user/user/factories/user.factory';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { Giveaway } from './entity/giveaway.entity';
import { GiveawayFactory } from './factories/giveaway.factory';
import { GiveawayListener } from './giveaway.listener';
import { GiveawayModule } from './giveaway.module';
import { GiveawayResolver } from './giveaway.resolver';

describe('GiveawayResolver', () => {
  let resolver: GiveawayResolver;
  let module: TestingModule;
  let app: any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([User, Giveaway, GiveawayBet]),
        GiveawayModule,
        CaseModule,
      ],
      providers: [GiveawayResolver],
    }).compile();

    resolver = module.get<GiveawayResolver>(GiveawayResolver);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create/remove/update giveaway', () => {
    test('correct create giveaway', async () => {
      const user = await UserFactory().create();
      const item = await ItemFactory().create({ market_hash_name: 'testName' });
      const giveaway = await resolver.createGiveaway(AuthorizedFactory(user), {
        itemId: item.id,
        endDate: new Date('2000-01-01'),
      });

      expect(giveaway.itemId).toEqual(item.id);
      expect(giveaway.endDate).toEqual(new Date('2000-01-01'));
    });
  });

  describe('get giveaway', () => {
    test('correct get giveaway', async () => {
      const user = await UserFactory().create();
      const item = await ItemFactory().create();
      const giveaway = await GiveawayFactory().create({ itemId: item.id });
      const res = await resolver.giveaway(
        AuthorizedFactory(user),
        `${giveaway.id}`,
      );
      expect(res.id).toEqual(giveaway.id);
    });

    test('correct get promocodes', async () => {
      await getConnection().getRepository(Giveaway).delete({});
      const user = await UserFactory().create();
      const item = await ItemFactory().create();
      await GiveawayFactory().createList(6, { itemId: item.id });

      const result = await resolver.giveaways(AuthorizedFactory(user));

      expect(result.data).toHaveLength(6);
    });
  });

  describe('correct join to daily/weekly giveaway', () => {
    test('correct join to daily giveaway', async () => {
      await getConnection().getRepository(Giveaway).delete({});

      const spy = jest.spyOn(module.get(GiveawayListener), 'openCase');
      const user = await UserFactory().create({ balance: 1000000 });
      const item = await ItemFactory().create({ market_hash_name: 'testName' });
      const dailyGiveaway = await resolver.createGiveaway(
        AuthorizedFactory(user),
        {
          itemId: item.id,
          endDate: new Date('2031-01-01'),
          type: GiveawayType.DAILY,
        },
      );
      const weeklyGiveaway = await resolver.createGiveaway(
        AuthorizedFactory(user),
        {
          itemId: item.id,
          endDate: new Date('2031-01-01'),
          type: GiveawayType.WEEKLY,
        },
      );

      const caseService = module.get<CaseService>(CaseService);
      const category = await CategoryFactory().create({ name: 'rar' });
      const [firstItem, secondItem] = await ItemFactory().createList(2);

      const box = await caseService.create(
        {
          bankPercent: 10,
          name: 'TestCase',
          price: 10,
          categories: [`${category.id}`],
        },
        AuthorizedFactory(user, 'admin'),
      );
      await CaseItemsFactory().create({ caseId: box.id, itemId: firstItem.id });
      await CaseItemsFactory().create({
        caseId: box.id,
        itemId: secondItem.id,
      });

      await caseService.open(
        {
          id: `${box.id}`,
          count: 1,
        },
        AuthorizedFactory(user),
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));

      expect(spy).toBeCalled();

      const res = await resolver.giveaway(
        AuthorizedFactory(user),
        `${dailyGiveaway.id}`,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
