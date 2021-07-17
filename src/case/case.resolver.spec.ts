import { Test, TestingModule } from '@nestjs/testing';
import { CaseResolver } from './case.resolver';

describe('CaseResolver', () => {
  let resolver: CaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseResolver],
    }).compile();

    resolver = module.get<CaseResolver>(CaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
