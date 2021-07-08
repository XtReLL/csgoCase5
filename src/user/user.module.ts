import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { TradeModule } from 'trade/trade.module';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisCacheModule, TradeModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
}) 
export class UserModule {}
 