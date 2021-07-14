import { Test, TestingModule } from '@nestjs/testing';
import { BackpackApiResolver } from './backpack-api.resolver';

describe('BackpackApiResolver', () => {
  let resolver: BackpackApiResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackpackApiResolver],
    }).compile();

    resolver = module.get<BackpackApiResolver>(BackpackApiResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
