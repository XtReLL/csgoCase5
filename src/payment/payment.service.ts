import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';
import { PaymentMethodType, PaymentStatusType } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { CreatePaymentInput } from './dto/createPaymentInput.input';
import { Payment } from './entity/payment.entity';
import crypto from 'crypto-js';
import {
  Client as CoinbaseClient,
  EventResource,
  resources as coinbaseResources,
} from 'coinbase-commerce-node';

import { UserService } from 'user/user/user.service';
import { paramsToBuilder } from 'list/params';
import { defaultPagination, Pagination } from 'list/pagination.input';

@Injectable()
export class PaymentService {
  private coinbaseClient = CoinbaseClient.init(
    process.env.COINBASE_APIKEY ?? '',
  );
  constructor(
    private readonly redisCacheService: RedisCacheService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly userService: UserService,
  ) {}

  async createPayment(
    user: User,
    createPaymentInput: CreatePaymentInput,
  ): Promise<{ payment: Payment; url: string }> {
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
        status: PaymentStatusType.PENDING,
        method: createPaymentInput.method,
      }),
    );
    if (createPaymentInput.method === PaymentMethodType.COINBASE) {
      const charge = await coinbaseResources.Charge.create({
        name: 'The Sovereign Individual',
        description: 'Mastering the Transition to the Information Age',
        pricing_type: 'fixed_price',
        local_price: {
          amount: `${createPaymentInput.sum}`,
          currency: 'RUB',
        },
      });

      payment.paymentId = charge.id;
      await this.paymentRepository.save(payment);

      return {
        payment,
        url: charge.hosted_url,
      };
    }

    if (createPaymentInput.method === PaymentMethodType.FREE_KASSA) {
      const sign = crypto.MD5(
        `${(await this.redisCacheService.get('config')).freekassaId}:${
          createPaymentInput.sum
        }:${(await this.redisCacheService.get('config')).freekassaSecret1}:${
          payment.id
        }`,
      );

      return {
        payment,
        url: `https://www.free-kassa.ru/merchant/cash.php?m=${
          (await this.redisCacheService.get('config')).freekassaId
        }&oa=${createPaymentInput.sum}&o=${payment.id}&s=${sign}`,
      };
    }
    return {
      payment,
      url: ``,
    };
  }

  async callbackFreeKassaPayment(query: any): Promise<boolean> {
    const payment = await this.paymentRepository.findOneOrFail({
      where: {
        id: query.MERCHANT_ORDER_ID,
        status: PaymentStatusType.PENDING,
      },
    });
    const user = await this.userService.findOne(payment.userId);

    const sign = crypto
      .MD5(
        `${(await this.redisCacheService.get('config')).freekassaId}:${
          payment.sum
        }:${(await this.redisCacheService.get('config')).freekassaSecret2}:${
          payment.id
        }`,
      )
      .toString();

    if (sign !== query.SIGN) {
      throw new Error('Error sign');
    }

    payment.status = PaymentStatusType.SUCCESSFUL;
    await this.paymentRepository.save(payment);

    // const sum = payment.sum + (await this.getBonus(user, payment));

    user.balance += payment.sum;
    await this.userService.update(user);

    return true;
  }

  async callbackCoinbasePayment(event: EventResource): Promise<boolean> {
    const payment = await this.paymentRepository.findOneOrFail({
      where: {
        id: event.id,
        status: PaymentStatusType.PENDING,
      },
    });

    const user = await this.userService.findOne(payment.userId);

    switch (event.type) {
      case 'charge:confirmed':
        payment.status = PaymentStatusType.SUCCESSFUL;
        await this.paymentRepository.save(payment);
        user.balance += payment.sum;
        await this.userService.update(user);
        return true;
      case 'charge:failed':
        payment.status = PaymentStatusType.REJECTED;
        await this.paymentRepository.save(payment);
        return false;
      default:
        return false;
    }

    // const sum = payment.sum + (await this.getBonus(user, payment));
  }

  async getUserPayments(
    userId: number,
    pagination: Pagination = defaultPagination,
  ): Promise<[Payment[], number]> {
    const query = await paramsToBuilder(
      this.paymentRepository.createQueryBuilder(),
      pagination,
    );

    query.andWhere('userId = :userId', { userId });
    return query.getManyAndCount();
  }
}
