import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { BackpackApiModule } from 'backpack-api/backpack-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    RedisCacheModule,
    CsgoMarketModule,
    HttpModule,
    BackpackApiModule,
  ],
  providers: [ItemService, ItemResolver],
  exports: [ItemService],
})
export class ItemModule {}
