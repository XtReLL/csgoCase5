import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { GiveawayModule } from 'giveaway/giveaway.module';
import { ItemModule } from 'item/item.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { User } from 'user/user/entity/user.entity';
import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { ConfigModule } from './config.module';
import { ConfigResolver } from './config.resolver';
import { ConfigService } from './config.service';
import { Config } from './entity/config.entity';

describe('ConfigResolver', () => {
  let resolver: ConfigResolver;
  let service: ConfigService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([User, Config]),
        ConfigModule,
        RedisCacheModule,
        ItemModule,
        UserModule,
        GiveawayModule,
      ],
      providers: [ConfigResolver, ConfigService],
    }).compile();

    resolver = module.get<ConfigResolver>(ConfigResolver);
    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
