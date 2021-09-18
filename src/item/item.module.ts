import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { CsgoMarketModule } from 'csgo-market/csgo-market.module';
import { BackpackApiModule } from 'backpack-api/backpack-api.module';
import { ConsoleModule } from 'nestjs-console';
import { ItemConsoleService } from './item.console.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    ConsoleModule,
    RedisCacheModule,
    CsgoMarketModule,
    HttpModule,
    BackpackApiModule,
  ],
  providers: [ItemService, ItemResolver, ItemConsoleService],
  exports: [ItemService],
})
export class ItemModule {}
