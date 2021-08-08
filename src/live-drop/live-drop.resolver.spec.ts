import { Test, TestingModule } from '@nestjs/testing';
import { LiveDropResolver } from './live-drop.resolver';

describe('LiveDropResolver', () => {
  let resolver: LiveDropResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveDropResolver],
    }).compile();

    resolver = module.get<LiveDropResolver>(LiveDropResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
