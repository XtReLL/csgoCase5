import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Item } from 'item/entity/item.entity';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { User } from 'user/user/entity/user.entity';

@Injectable()
export class CsgoMarketService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

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

  async searchItemByHashName(item: Item): Promise<any> {
    return new Promise((res, rej) => {
      axios
        .get(
          `https://market.csgo.com/api/v2/search-item-by-hash-name?key=${process.env.CSGO_MARKET_APIKEY}` +
            `&hash_name=${encodeURI(item.marketHashName)}`,
        )
        .then((data) => {
          const result = data.data;

          if (!result.success) {
            return rej('Предмет не найден в магазине');
          }

          if (typeof result.data[0] === 'undefined') {
            return rej('Предмет не найден в магазине');
          }

          return res(result.data[0]);
        })
        .catch((e) => {
          return rej(e.message);
        });
    });
  }

  async buyItem(item: any, user: User): Promise<any> {
    return new Promise((res, rej) => {
      const partner = user.tradeUrl.split('partner=')[1].split('&')[0];
      const token = user.tradeUrl.split('token=')[1];
      const customId = Math.random().toString(36).substring(2, 15);

      axios
        .get(
          `https://market.csgo.com/api/v2/buy-for?key=${process.env.CSGO_MARKET_APIKEY}` +
            `&hash_name=${encodeURI(item.market_hash_name)}&price=${
              item.price
            }&partner=${partner}&token=${token}&custom_id=${customId}`,
        )
        .then((data) => {
          const result = data.data;

          if (!result.success) {
            if (typeof result.error !== 'undefined') {
              return rej(result.error);
            } else {
              return rej('Item Purchase Error');
            }
          }

          return res({
            custom_id: customId,
          });
        })
        .catch((e) => {
          return rej(e.message);
        });
    });
  }

  async getTradeByCustomIds(customIds: Array<string>): Promise<any> {
    return new Promise((res) => {
      let customIdList = '';

      for (const customId of customIds) {
        customIdList += `&custom_id[]=${customId}`;
      }

      axios
        .get(
          `https://market.csgo.com/api/v2/get-list-buy-info-by-custom-id?key=${process.env.CSGO_MARKET_APIKEY}${customIdList}`,
        )
        .then((data) => {
          const result = data.data;

          if (!result.success) {
            return res([]);
          }

          return res(result.data);
        })
        .catch(() => {
          return res([]);
        });
    });
  }
}
