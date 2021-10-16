import { Payment } from 'payment/entity/payment.entity';
import { Factory } from 'typeorm-factory';

export const PaymentFactory = () => new Factory(Payment).attr('sum', 100);
