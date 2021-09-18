import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from 'inventory/inventory.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { TradeModule } from 'trade/trade.module';
import { ReferallModule } from 'user/referall/referall.module';
import { Role } from './entity/role.entity';
import { UserRole } from './entity/user-role.entity';
import { User } from './entity/user.entity';
import { UserLoader } from './user.loader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    RedisCacheModule,
    TradeModule,
    ReferallModule,
    forwardRef(() => InventoryModule),
  ],
  providers: [UserResolver, UserService, UserLoader],
  exports: [UserService],
})
export class UserModule {}
