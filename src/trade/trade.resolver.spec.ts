import { Test, TestingModule } from '@nestjs/testing';
import { TradeResolver } from './trade.resolver';

describe('TradeResolver', () => {
  let resolver: TradeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeResolver],
    }).compile();

    resolver = module.get<TradeResolver>(TradeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
