import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { InventoryModule } from 'inventory/inventory.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';

import { WithdrawRepository } from './withdraw.repository';
import { WithdrawResolver } from './withdraw.resolver';
import { WithdrawService } from './withdraw.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WithdrawRepository]),
    RedisCacheModule,
    InventoryModule,
    CsgoMarketModule,
  ],
  providers: [WithdrawResolver, WithdrawService],
  exports: [WithdrawService],
})
export class WithdrawModule {}
