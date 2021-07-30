import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawResolver } from './withdraw.resolver';

describe('WithdrawResolver', () => {
  let resolver: WithdrawResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawResolver],
    }).compile();

    resolver = module.get<WithdrawResolver>(WithdrawResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
