import { forwardRef, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { Item } from 'item/entity/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { UserModule } from 'user/user/user.module';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { InventoryRepository } from './inventory.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, InventoryRepository, WithdrawItem]),
    RedisCacheModule,
    forwardRef(() => UserModule),
    CsgoMarketModule,
  ],
  providers: [InventoryService, InventoryResolver],
  exports: [InventoryService],
})
export class InventoryModule {}
