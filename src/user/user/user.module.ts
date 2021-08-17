import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { TradeModule } from 'trade/trade.module';
import { ReferallModule } from 'user/referall/referall.module';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    TradeModule,
    ReferallModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
