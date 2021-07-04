import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { getTestModules } from 'testModules';
import { User } from 'user/entity/user.entity';
import { UserFactory } from 'user/factories/user.factory';
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
        PromocodeModule
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
      const promocode = await resolver.createPromocode({name, sum: 10}, AuthorizedFactory(user))

      expect(promocode.name).toEqual(name)
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
