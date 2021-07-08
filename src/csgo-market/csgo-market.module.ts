import { Module } from '@nestjs/common';
import { CsgoMarketService } from './csgo-market.service';

@Module({
  providers: [CsgoMarketService],
  exports: [CsgoMarketService],
})
export class CsgoMarketModule {}
