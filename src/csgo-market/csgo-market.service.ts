import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CsgoMarketService {
  constructor() {}

  async getPrices(): Promise<any> {
    return new Promise((res, rej) => {
      axios
        .get(`https://market.csgo.com/api/v2/prices/RUB.json`)
        .then((data) => {
          const result = data.data;

          if (result.success) {
            return res(result.items);
          }

          return rej("Could't get prices");
        })
        .catch((e) => {
          return rej(e.message);
        });
    });
  }
}
