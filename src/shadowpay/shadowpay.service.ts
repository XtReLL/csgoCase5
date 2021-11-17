import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { CreateShadowpayPaymentDto } from './dto/createShadowpayPayment.dto';

@Injectable()
export class ShadowpayService {
  constructor(private readonly redisCacheService: RedisCacheService) {}
  async createPayment(params: CreateShadowpayPaymentDto): Promise<any> {
    return new Promise(async (res, rej) => {
      axios
        .post(
          `https://shadowpay.com/en/pay/${
            (await this.redisCacheService.get('config')).shadowpayPublicKey
          }?&account=${params.userId}&order_id=${
            params.paymentId
          }&security_steam_id=${params.steamId}&currency=USD&signature=${
            params.signature
          }&amount=${params.amount}`,
          {},
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then((data) => {
          const result = data.data;
          console.log(data);

          if (result.success) {
            return res(result);
          }

          return rej("Could't create shadowpay payment");
        })
        .catch((e) => {
          console.log(e);

          return rej(e.message);
        });
    });
  }
}
