import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'redisCache/redisCache.module';

import { UserModule } from 'user/user/user.module';
import { PromocodeUse } from './entity/promocode-use.entity';
import { Promocode } from './entity/promocode.entity';
import { PromocodeResolver } from './promocode.resolver';
import { PromocodeService } from './promocode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promocode, PromocodeUse]),
    RedisCacheModule,
    UserModule,
  ],
  providers: [PromocodeResolver, PromocodeService],
  exports: [PromocodeService],
})
export class PromocodeModule {}
