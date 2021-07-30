import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawService } from './withdraw.service';

describe('WithdrawService', () => {
  let service: WithdrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawService],
    }).compile();

    service = module.get<WithdrawService>(WithdrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
