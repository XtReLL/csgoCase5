import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { ShadowpayService } from './shadowpay.service';

@Module({
  imports: [RedisCacheModule],
  providers: [ShadowpayService],
  exports: [ShadowpayService],
})
export class ShadowpayModule {}
