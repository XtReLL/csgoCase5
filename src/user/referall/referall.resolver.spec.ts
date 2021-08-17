import { Test, TestingModule } from '@nestjs/testing';
import { ReferallResolver } from './referall.resolver';

describe('ReferallResolver', () => {
  let resolver: ReferallResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferallResolver],
    }).compile();

    resolver = module.get<ReferallResolver>(ReferallResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
