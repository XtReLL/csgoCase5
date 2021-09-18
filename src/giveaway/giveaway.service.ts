import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { findOrCreate } from 'base/repository';
import { error } from 'console';
import { InventoryService } from 'inventory/inventory.service';
import { ItemService } from 'item/item.service';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { IsNull, Raw, Repository } from 'typeorm';
import { GiveawayType, SearchGiveawayInput } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { CreateGiveawayInput } from './dto/createGiveawayInput.input';
import { UpdateGiveawayInput } from './dto/updateGiveawayInput.input';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { Giveaway } from './entity/giveaway.entity';

@Injectable()
export class GiveawayService {
  constructor(
    @InjectRepository(Giveaway)
    private readonly giveawayRepository: Repository<Giveaway>,
    @InjectRepository(GiveawayBet)
    private readonly giveawayBetRepository: Repository<GiveawayBet>,
    private readonly inventoryService: InventoryService,
    private readonly itemService: ItemService,
  ) {}

  async bootstrap(): Promise<void> {
    try {
      this.dailyGiveaway();
      this.weeklyGiveaway();
    } catch (error) {
      console.log(error);
    }
  }

  async joinToGiveaway(user: User, giveawayId: number): Promise<GiveawayBet> {
    return await this.giveawayBetRepository.save(
      this.giveawayBetRepository.create({
        userId: user.id,
        giveawayId: giveawayId,
      }),
    );
  }

  async create(createGiveawayInput: CreateGiveawayInput): Promise<Giveaway> {
    return await this.giveawayRepository.save(
      this.giveawayRepository.create({
        itemId: createGiveawayInput.itemId,
        endDate: createGiveawayInput.endDate,
        type: createGiveawayInput.type,
      }),
    );
  }

  async update(
    user: User,
    updateGiveawayInput: UpdateGiveawayInput,
  ): Promise<Giveaway> {
    const id = parseInt(updateGiveawayInput.id);
    const giveaway = await this.giveawayRepository.findOneOrFail(id);

    return this.giveawayRepository.save(
      this.giveawayRepository.merge(giveaway, { ...updateGiveawayInput, id }),
    );
  }

  async remove(user: User, giveawayId: string): Promise<boolean> {
    const giveaway = await this.giveawayRepository.findOneOrFail(
      parseInt(giveawayId, 10),
    );
    await this.giveawayRepository.softRemove(giveaway);
    return true;
  }

  async setWinner(giveawayId: number): Promise<Giveaway> {
    const giveaway = await this.giveawayRepository.findOneOrFail(giveawayId);

    const winnerBet = await this.giveawayBetRepository
      .createQueryBuilder('bet')
      .innerJoinAndSelect('bet.user', 'user')
      .orderBy('RAND()')
      .limit(1)
      .getOneOrFail();

    giveaway.winnerId = winnerBet.userId;
    await this.giveawayRepository.save(giveaway);

    await this.inventoryService.addItems({
      userId: winnerBet.userId,
      itemId: giveaway.itemId,
      price: (await giveaway.item).price,
    });

    return giveaway;
  }

  async getActiveGiveaways(
    authorized: AuthorizedModel,
    pagination = defaultPagination,
  ): Promise<[Giveaway[], number]> {
    const query = await paramsToBuilder(
      this.giveawayRepository.createQueryBuilder(),
      pagination,
    );
    return await query.andWhere('winnerId IS NULL').getManyAndCount();
  }

  async getLastGiveaways(
    authorized: AuthorizedModel,
    pagination = defaultPagination,
  ): Promise<[Giveaway[], number]> {
    const query = await paramsToBuilder(
      this.giveawayRepository.createQueryBuilder(),
      pagination,
    );

    return await query.andWhere('winnerId IS NOT NULL').getManyAndCount();
  }

  async list(
    model: AuthorizedModel,
    pagination: Pagination = defaultPagination,
    search?: SearchGiveawayInput,
  ): Promise<[Giveaway[], number]> {
    const query = await paramsToBuilder<Giveaway>(
      this.giveawayRepository.createQueryBuilder(),
      pagination,
    );

    if (search?.type) {
      query.andWhere('type = :type', { type: search.type });
    }

    const result = await query.getManyAndCount();

    return result;
  }

  async findOne(giveawayId: string): Promise<Giveaway> {
    return this.giveawayRepository.findOneOrFail(parseInt(giveawayId, 10));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyGiveaway(): Promise<void> {
    if (
      await this.giveawayRepository.findOne({
        where: { type: GiveawayType.DAILY },
      })
    ) {
      return;
    }
    const randomItem = await this.itemService.getRandomItem();

    await findOrCreate(this.giveawayRepository, {
      itemId: randomItem.id,
      endDate: new Date(Date.now() + 86220000),
      type: GiveawayType.DAILY,
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  async weeklyGiveaway(): Promise<void> {
    if (
      await this.giveawayRepository.findOne({
        where: { type: GiveawayType.WEEKLY },
      })
    ) {
      return;
    }
    const randomItem = await this.itemService.getRandomItem();
    await findOrCreate(this.giveawayRepository, {
      itemId: randomItem.id,
      endDate: new Date(Date.now() + 604620000),
      type: GiveawayType.WEEKLY,
    });
  }

  async getWeeklyGiveaway(): Promise<Giveaway> {
    return this.giveawayRepository.findOneOrFail({
      where: { type: GiveawayType.WEEKLY },
    });
  }

  async getDailyGiveaway(): Promise<Giveaway> {
    return this.giveawayRepository.findOneOrFail({
      where: { type: GiveawayType.DAILY },
    });
  }
}
