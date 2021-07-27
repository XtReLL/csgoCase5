import { InputType } from '@nestjs/graphql';
import {
  CreatePaymentInput as CreatePaymentInputInterface,
  PaymentMethodType,
} from 'typings/graphql';

@InputType()
export class CreatePaymentInput implements CreatePaymentInputInterface {
  method!: PaymentMethodType;
  sum!: number;
}
