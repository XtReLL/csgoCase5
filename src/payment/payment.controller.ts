import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('callback/freekassa')
  async callbackFreekassa(@Query() query: any) {
    try {
      return await this.paymentService.callbackFreeKassaPayment(query);
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
}
