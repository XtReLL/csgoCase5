import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';
import { PaymentStatusType } from 'typings/graphql';
import { User } from 'user/entity/user.entity';
import { CreatePaymentInput } from './dto/createPaymentInput.input';
import { Payment } from './entity/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(user: User, createPaymentInput: CreatePaymentInput) {
    if (
      createPaymentInput.sum <
      (await this.redisCacheService.get('config')).minPayment
    ) {
      throw new Error(
        `Minimum deposit amount - ${
          (await this.redisCacheService.get('config')).minPayment
        }`,
      );
    }

    if (
      createPaymentInput.sum >
      (await this.redisCacheService.get('config')).maxPayment
    ) {
      throw new Error(
        `Maximum deposit amount - ${
          (await this.redisCacheService.get('config')).maxPayment
        }$.`,
      );
    }

    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        sum: createPaymentInput.sum,
        userId: user.id,
      }),
    );
    //... method logic
    return payment;
  }

  async callbackPayment(query: any) {}
}
