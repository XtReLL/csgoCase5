import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
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
  ): Promise<Payment> {
    return await this.paymentService.createPayment(
      author.model,
      createPaymentInput,
    );
  }
}
