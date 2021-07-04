import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientModule } from 'redis-client/redis-client.module';
import { UserModule } from 'user/user.module';
import { PromocodeUse } from './entity/promocode-use.entity';
import { Promocode } from './entity/promocode.entity';
import { PromocodeResolver } from './promocode.resolver';
import { PromocodeService } from './promocode.service';

@Module({ 
  imports: [TypeOrmModule.forFeature([Promocode, PromocodeUse]), RedisClientModule, UserModule],
  providers: [PromocodeResolver, PromocodeService],
  exports: [PromocodeService]
}) 
export class PromocodeModule {}
 