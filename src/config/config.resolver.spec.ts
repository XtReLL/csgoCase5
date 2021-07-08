import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { getTestModules } from 'testModules';
import { User } from 'user/entity/user.entity';
import { UserFactory } from 'user/factories/user.factory';
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
      ],
      providers: [ConfigResolver, ConfigService],
    }).compile();

    resolver = module.get<ConfigResolver>(ConfigResolver);
    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should be defined entity database', async () => {
    expect(await service.initialConfig()).not.toBeNull();
  });

  afterAll(async () => {
    await module.close();
  });
});
