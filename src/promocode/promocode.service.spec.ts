import { Test, TestingModule } from '@nestjs/testing';
import { PromocodeService } from './promocode.service';

describe('PromocodeService', () => {
  let service: PromocodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromocodeService],
    }).compile();

    service = module.get<PromocodeService>(PromocodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
