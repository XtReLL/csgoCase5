import {
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Webhook } from 'coinbase-commerce-node';

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

  // @Post('coinbase-hook')
  // async coinbaseHook(@Req() req: Request) {
  //   const event = Webhook.verifyEventBody(
  //     req.body,
  //     req.headers.get('x-cc-webhook-signature'),
  //     '3bc94370-cb27-4dd7-8cc3-4925da9eecb7',
  //   );
  // }
}
