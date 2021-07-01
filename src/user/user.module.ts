import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientModule } from 'redis-client/redis-client.module';
import { TradeModule } from 'trade/trade.module';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisClientModule, TradeModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
}) 
export class UserModule {}
 