import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedFactory } from 'auth/factory/authorized.factory';

import { getTestModules } from 'testModules';

import { UserFactory } from 'user/user/factories/user.factory';
import { UserModule } from 'user/user/user.module';
import { Payment } from './entity/payment.entity';
import { PaymentFactory } from './factories/payment.factory';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

describe('PaymentResolver', () => {
  let paymentResolver: PaymentResolver;
  let paymentService: PaymentService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...getTestModules(),
        TypeOrmModule.forFeature([Payment]),
        UserModule,
      ],
      providers: [PaymentResolver, PaymentService],
    }).compile();

    paymentResolver = module.get<PaymentResolver>(PaymentResolver);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentResolver).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('get payment', () => {
    test('correct get userPayments', async () => {
      const user = await UserFactory().create();
      await PaymentFactory().createList(9, { userId: user.id });
      const result = await paymentResolver.getUserPayments(
        AuthorizedFactory(user),
        user.id,
      );
      expect(result.data[0].userId).toEqual(user.id);
      expect(result.data).toHaveLength(9);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
