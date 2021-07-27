import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('callback')
  async callback(@Query() query: any) {
    try {
      return await this.paymentService.callbackPayment(query);
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
}
