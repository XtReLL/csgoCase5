import { Test, TestingModule } from '@nestjs/testing';
import { PaybackSystemResolver } from './payback-system.resolver';

describe('PaybackSystemResolver', () => {
  let resolver: PaybackSystemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaybackSystemResolver],
    }).compile();

    resolver = module.get<PaybackSystemResolver>(PaybackSystemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
