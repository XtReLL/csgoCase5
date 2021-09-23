import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForbiddenError } from 'apollo-server-express';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { InventoryModule } from 'inventory/inventory.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';

import { getTestModules } from 'testModules';
import { TradeModule } from 'trade/trade.module';
import { getConnection, getManager } from 'typeorm';
import { ReferallModule } from 'user/referall/referall.module';
import { Role } from './entity/role.entity';
import { UserRole } from './entity/user-role.entity';
import { User } from './entity/user.entity';

import { UserFactory } from './factories/user.factory';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let module: TestingModule;

  let userLoader: any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([User, Role, UserRole]),
        ReferallModule,
        RedisCacheModule,
        TradeModule,
        InventoryModule,
      ],
      providers: [UserResolver, UserService],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);

    userLoader = {
      loadMany: (ids: string[]) =>
        getConnection().getRepository(User).findByIds(ids),
      load: (id: string) => getManager().getRepository(User).findOne(id),
      prime: () => {
        return;
      },
    };
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('user', () => {
    test('correct get self', async () => {
      const user = await UserFactory().create();
      const result = await userResolver.findOne(
        AuthorizedFactory(user),
        undefined,
        userLoader,
      );
      expect(result.id).toEqual(user.id);
    });

    test('correct get another user', async () => {
      const user = await UserFactory().create();
      const anotherUser = await UserFactory().create();
      const result = await userResolver.findOne(
        AuthorizedFactory(user),
        `${anotherUser.id}`,
        userLoader,
      );
      expect(result.id).toEqual(anotherUser.id);
    });
  });

  describe('users', () => {
    test('correct get list', async () => {
      const users = await UserFactory().createList(10);
      const result = await userResolver.list(
        AuthorizedFactory(users[0]),
        userLoader,
      );
      expect(result.data).toHaveLength(10);
    });

    // test('correct get with filter', async () => {
    //   const factory = UserFactory();
    //   await factory.createList(10);
    //   const filteredUser = await factory.create({ username: 'Filter' });
    //   const result = await userResolver.list(
    //     AuthorizedFactory(filteredUser),
    //     userLoader,
    //     {
    //       query: 'filt',
    //     },
    //   );
    //   expect(result.data).not.toHaveLength(0);
    //   result.data.forEach((item) => expect(item.firstName).toEqual('Filter'));
    // });
  });

  afterAll(async () => {
    await module.close();
  });
});
