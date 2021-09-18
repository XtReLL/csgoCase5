import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { config } from '../redisconfig';
import { RedisCacheService } from './redisCache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...config,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
