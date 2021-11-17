import { Test, TestingModule } from '@nestjs/testing';
import { ShadowpayService } from './shadowpay.service';

describe('ShadowpayService', () => {
  let service: ShadowpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShadowpayService],
    }).compile();

    service = module.get<ShadowpayService>(ShadowpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
