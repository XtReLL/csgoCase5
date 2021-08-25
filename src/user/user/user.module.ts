import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from 'inventory/inventory.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { TradeModule } from 'trade/trade.module';
import { ReferallModule } from 'user/referall/referall.module';
import { User } from './entity/user.entity';
import { UserLoader } from './user.loader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    TradeModule,
    ReferallModule,
    forwardRef(() => InventoryModule),
  ],
  providers: [UserResolver, UserService, UserLoader],
  exports: [UserService],
})
export class UserModule {}
