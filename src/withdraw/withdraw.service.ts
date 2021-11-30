import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { CsgoMarketService } from 'csgo-market/csgo-market.service';
import { InventoryService } from 'inventory/inventory.service';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Raw } from 'typeorm';
import { InventoryStatus, WithdrawStatusType } from 'typings/graphql';
import { WithdrawRepository } from './withdraw.repository';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly inventoryService: InventoryService,
    @InjectRepository(WithdrawRepository)
    private readonly withdrawRepository: WithdrawRepository,
    private readonly marketCsgoService: CsgoMarketService,
  ) {}
  async test(author: AuthorizedModel, inventoryId: number): Promise<void> {
    if (
      (await this.redisCacheService.get(`withdraw_${author.model.id}`)) !== null
    ) {
      throw 'Please, wait a bit and try again';
    }

    await this.redisCacheService.set(`withdraw_${author.model.id}`, 1, {
      ttl: 1000 * 10,
    });

    if (!author.model.tradeUrl) {
      throw 'Введите ссылку на обмен';
    }

    const inventory = await this.inventoryService.findOne(inventoryId);

    if (
      !inventory ||
      inventory.userId !== author.model.id ||
      inventory.status !== InventoryStatus.AVAILABLE
    ) {
      throw 'Предмет недоступен для вывода';
    }

    const withdraw = await this.withdrawRepository.save(
      this.withdrawRepository.create({
        userId: author.model.id,
        inventoryId: inventory.id,
      }),
    );

    await this.redisCacheService.delete(
      `withdraw_${author.model.id}`,
      (error: any) => {
        throw new Error(error);
      },
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getStatusMarket() {
    const withdraws = await this.withdrawRepository.find({
      where: {
        status: WithdrawStatusType.PENDING,
        custom_id: Raw((alias) => `${alias} IS NOT NULL`),
      },
    });

    const customIds: Array<string> = [];

    for (const withdraw of withdraws) {
      customIds.push(withdraw.customId);
    }

    const trades = await this.marketCsgoService.getTradeByCustomIds(customIds);

    for (const customId in trades) {
      const trade = trades[customId];
      const withdraw = await this.withdrawRepository.findOneOrFail({
        where: {
          customId,
        },
      });

      if (trade.stage === '2') {
        withdraw.status = WithdrawStatusType.SUCCESSFUL;
        await this.withdrawRepository.save(withdraw);
      }

      if (trade.stage === '5') {
        withdraw.status = WithdrawStatusType.REJECTED;
        await this.withdrawRepository.save(withdraw);
      }
    }
  }
}
