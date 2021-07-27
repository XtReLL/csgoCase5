import { Test, TestingModule } from '@nestjs/testing';
import { GiveawayResolver } from './giveaway.resolver';

describe('GiveawayResolver', () => {
  let resolver: GiveawayResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiveawayResolver],
    }).compile();

    resolver = module.get<GiveawayResolver>(GiveawayResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
