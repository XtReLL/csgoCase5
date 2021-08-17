import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { BackpackApiModule } from 'backpack-api/backpack-api.module';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { GameModule } from 'game/game/game.module';
import { LiveDropModule } from 'live-drop/live-drop.module';
import { PaybackSystemModule } from 'payback-system/payback-system.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { CaseModule } from './case.module';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { CaseFactory } from './factories/case.factory';

describe('CaseResolver', () => {
  let service: CaseService;
  let resolver: CaseResolver;
  let module: TestingModule;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Case, CaseItems]),
        CaseModule,
        UserModule,
        GameModule,
        RedisCacheModule,
        PaybackSystemModule,
        LiveDropModule,
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

  // describe('create case', () => {
  //   test('currect create case', async () => {
  //     const user = await UserFactory().create();
  //     const box = await resolver.createCase(AuthorizedFactory(user), {
  //       bankPercent: 10,
  //       name: 'TestCase',
  //       price: 10,
  //     });

  //     expect(box.id).(box.id);
  //   });
  // });

  afterAll(async () => {
    await module.close();
  });
});
