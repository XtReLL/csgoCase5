import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { getTestModules } from 'testModules';
import { getConnection } from 'typeorm';
import { User } from 'user/user/entity/user.entity';
import { UserFactory } from 'user/user/factories/user.factory';
import { Promocode } from './entity/promocode.entity';
import { PromocodeModule } from './promocode.module';
import { PromocodeResolver } from './promocode.resolver';

describe('PromocodeResolver', () => {
  let resolver: PromocodeResolver;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([User, Promocode]),
        PromocodeModule,
      ],
      providers: [PromocodeResolver],
    }).compile();

    resolver = module.get<PromocodeResolver>(PromocodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create/remove/update promocode', () => {
    test('correct create promocode', async () => {
      const user = await UserFactory().create();
      const name = 'newPromocode';
      const promocode = await resolver.createPromocode(
        { name, sum: 10 },
        AuthorizedFactory(user),
      );

      expect(promocode.name).toEqual(name);
    });
  });

  describe('get promocode', () => {
    test('correct get promocode', async () => {
      const user = await UserFactory().create();
      const name = 'newPromocode';
      const promocode = await resolver.createPromocode(
        { name, sum: 10 },
        AuthorizedFactory(user),
      );

      const res = await resolver.promocode(
        AuthorizedFactory(user),
        `${promocode.id}`,
      );
      expect(res.id).toEqual(promocode.id);
      expect(res.name).toEqual(name);
    });

    test('correct get promocodes', async () => {
      await getConnection().getRepository(Promocode).delete({});
      const user = await UserFactory().create();
      const name = 'newListPromocode';
      await resolver.createPromocode(
        { name, sum: 10 },
        AuthorizedFactory(user),
      );
      await resolver.createPromocode(
        { name, sum: 10 },
        AuthorizedFactory(user),
      );

      const result = await resolver.promocodes(AuthorizedFactory(user));

      expect(result.data).toHaveLength(2);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
