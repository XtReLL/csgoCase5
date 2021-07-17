import { Test, TestingModule } from '@nestjs/testing';
import { InventoryResolver } from './inventory.resolver';

describe('InventoryResolver', () => {
  let resolver: InventoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryResolver],
    }).compile();

    resolver = module.get<InventoryResolver>(InventoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
