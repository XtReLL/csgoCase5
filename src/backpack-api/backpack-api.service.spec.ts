import { Test, TestingModule } from '@nestjs/testing';
import { BackpackApiService } from './backpack-api.service';

describe('BackpackApiService', () => {
  let service: BackpackApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackpackApiService],
    }).compile();

    service = module.get<BackpackApiService>(BackpackApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
