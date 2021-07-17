import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { Item } from 'item/entity/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Inventory]),
    RedisCacheModule,
    UserModule,
  ],
  providers: [InventoryService, InventoryResolver],
  exports: [InventoryService],
})
export class InventoryModule {}
