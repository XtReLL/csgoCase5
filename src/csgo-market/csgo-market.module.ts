import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { CsgoMarketService } from './csgo-market.service';

@Module({
  imports: [RedisCacheModule],
  providers: [CsgoMarketService],
  exports: [CsgoMarketService],
})
export class CsgoMarketModule {}
