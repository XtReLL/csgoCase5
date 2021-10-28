import { Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { query } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('callback/freekassa')
  async callbackFreekassa(@Query() query: any) {
    try {
      return await this.paymentService.callbackFreeKassaPayment(query);
    } catch (e: any) {
      throw new HttpException(e, 400);
    }
  }

  @Post('coinbase-hook')
  async coinbaseHook(@Query() query: any) {
    console.log(query);
  }
}
