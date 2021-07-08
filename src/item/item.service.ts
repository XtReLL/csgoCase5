import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Repository } from 'typeorm';
import {
  makeLimiterFromLimiters,
  makeLimiterWorkPerSecond,
  makeLimiterWorkPerTime,
  RateLimitQueue,
} from 'utils/limiter';
import { Item } from './entity/item.entity';

@Injectable()
export class ItemService {
  protected readonly itemLoaderQueue = new RateLimitQueue(
    makeLimiterFromLimiters([
      makeLimiterWorkPerSecond(1),
      makeLimiterWorkPerTime(5, 1000 * 60),
      makeLimiterWorkPerTime(15, 1000 * 60 * 5),
    ]),
  );

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly csgoMarketService: CsgoMarketService,
    private readonly httpService: HttpService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async checkItems(): Promise<boolean> {
    try {
      const itemsCount = await this.itemRepository.count();
      if (itemsCount === 0) {
        await this.loadItems();
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loadItems(): Promise<boolean> {
    try {
      const prices = await this.csgoMarketService.getPrices();

      for await (const marketItem of this.generatorSteamMarketItems()) {
        try {
          const priceIndex = prices.findIndex(
            (x: any) => x.market_hash_name === marketItem.hash_name,
          );

          if (priceIndex > -1) {
            let price;

            if (prices[priceIndex].volume > 10) {
              price =
                prices[priceIndex].price /
                (await this.redisCacheService.get('config')).dollarRate;
            } else {
              price = marketItem.sell_price / 100;
            }

            const item = marketItem.asset_description;

            if (item.icon_url_large === null) {
              continue;
            }

            if (
              price < (await this.redisCacheService.get('config')).minItemPrice
            ) {
              continue;
            }

            const exterior = '';
            const rarity = item.type;

            await this.itemRepository.save(
              this.itemRepository.create({
                market_hash_name: item.market_hash_name,
                icon_url:
                  item.icon_url_large === ''
                    ? item.icon_url
                    : item.icon_url_large,
                exterior: exterior,
                rarity: rarity,
                color: item.name_color,
                price,
              }),
            );
          }
        } catch (e) {
          throw new Error('Failed to create item');
        }
      }

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async *generatorSteamMarketItems(startPage: number = 0) {
    let currentPage = startPage;
    const loaderBreakRule = (page: any) =>
      page.start >= page.total_count ||
      page.results.some(
        async (i: any) =>
          i.sell_listings <
          (await this.redisCacheService.get('config')).minItemPrice,
      );

    while (true) {
      const page = await this.itemLoaderQueue.add(() =>
        this.loadItemsPage(currentPage),
      );

      for (const item of page.results)
        if (
          item.sell_listings >
          (await this.redisCacheService.get('config')).minItemPrice
        )
          yield item;

      if (loaderBreakRule(page)) break;
      currentPage++;
    }
  }

  async loadItemsPage(page: number = 0, perPage: number = 1000): Promise<any> {
    perPage = Math.min(100, perPage);

    const { data } = await this.httpService
      .get(`https://steamcommunity.com/market/search/render`, {
        params: {
          query: '',
          start: page * perPage,
          count: perPage,
          search_descriptions: 0,
          norender: 1,
          sort_column: 'quantity',
          sort_dir: 'desc',
          appid: 730,
        },
      })
      .toPromise();

    return data;
  }
}
