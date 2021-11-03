import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';
import { CreatePaymentInput } from './dto/createPaymentInput.input';
import { Payment } from './entity/payment.entity';

import { PaymentService } from './payment.service';

@Resolver('payment')
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation('createPayment')
  async createPayment(
    @Authorized() author: AuthorizedModel,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<string> {
    const { payment, url } = await this.paymentService.createPayment(
      author.model,
      createPaymentInput,
    );

    return url;
  }

  @Query('getUserPayments')
  async getUserPayments(
    @Authorized() author: AuthorizedModel,
    @Args('userId') userId: number,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Payment>> {
    return formatList(
      await this.paymentService.getUserPayments(userId, pagination),
      `user-${userId}_payments`,
      pagination,
    );
  }
}
