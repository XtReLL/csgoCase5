import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BackpackApiService } from 'backpack-api/backpack-api.service';
import { randomInt } from 'crypto';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';

import { Item } from './entity/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly csgoMarketService: CsgoMarketService,
    private readonly httpService: HttpService,
    private readonly redisCacheService: RedisCacheService,
    private readonly backpackService: BackpackApiService,
  ) {}

  // async onApplicationBootstrap(): Promise<boolean> {
  //   await this.checkItems();
  //   return true;
  // }
  async findOne(itemId: number): Promise<Item> {
    return await this.itemRepository.findOneOrFail(itemId);
  }

  async getRandomItem(): Promise<Item> {
    return await this.findOne(randomInt(10000));
  }

  async checkItems(): Promise<boolean> {
    try {
      const itemsCount = await this.itemRepository.count();

      if (itemsCount === 0) {
        await this.getItems();
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getItems(): Promise<any> {
    try {
      const entities: Array<Item> = [];
      const prices = await this.csgoMarketService.getPrices();
      for (const [key, value] of Object.entries(
        await this.backpackService.getItems(),
      )) {
        try {
          const priceIndex = prices.findIndex(
            (x: any) => x.market_hash_name === value.name,
          );
          if (priceIndex > -1) {
            let price;

            if (prices[priceIndex].volume > 10) {
              price =
                prices[priceIndex].price /
                (await this.redisCacheService.get('config')).dollarRate;
            } else {
              price =
                prices[priceIndex].price -
                ((prices[priceIndex].price / 100) * 30) /
                  (await this.redisCacheService.get('config')).dollarRate;
            }

            if (value.icon_url_large === null) {
              continue;
            }

            if (
              price < (await this.redisCacheService.get('config')).minItemPrice
            ) {
              continue;
            }

            entities.push(
              this.itemRepository.create({
                marketHashName: value.name,
                iconUrl:
                  value.icon_url_large === ''
                    ? value.icon_url
                    : value.icon_url_large,
                exterior: value.exterior,
                rarity: value.rarity,
                color: value.rarity_color,
                price,
              }),
            );
          }
        } catch (error) {
          throw new Error(error);
        }
      }

      await this.itemRepository.save(entities);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
