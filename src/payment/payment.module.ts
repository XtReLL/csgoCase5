import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentResolver } from './payment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { UserModule } from 'user/user/user.module';
import { ShadowpayModule } from 'shadowpay/shadowpay.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ShadowpayModule,
    RedisCacheModule,
    UserModule,
  ],
  providers: [PaymentService, PaymentResolver],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
