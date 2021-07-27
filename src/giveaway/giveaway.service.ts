import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { InventoryService } from 'inventory/inventory.service';
import { defaultPagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { IsNull, Raw, Repository } from 'typeorm';
import { User } from 'user/entity/user.entity';
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
  ) {}

  async joinToGiveaway(user: User, giveawayId: string): Promise<GiveawayBet> {
    return await this.giveawayBetRepository.save(
      this.giveawayBetRepository.create({
        userId: user.id,
        giveawayId: parseInt(giveawayId, 10),
      }),
    );
  }

  async create(
    user: User,
    createGiveawayInput: CreateGiveawayInput,
  ): Promise<Giveaway> {
    return await this.giveawayRepository.save(
      this.giveawayRepository.create({
        itemId: createGiveawayInput.itemId,
        endDate: createGiveawayInput.endDate,
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
    const query = paramsToBuilder(
      this.giveawayRepository.createQueryBuilder(),
      pagination,
    );
    return await query.andWhere('winnerId IS NULL').getManyAndCount();
  }

  async getLastGiveaways(
    authorized: AuthorizedModel,
    pagination = defaultPagination,
  ): Promise<[Giveaway[], number]> {
    const query = paramsToBuilder(
      this.giveawayRepository.createQueryBuilder(),
      pagination,
    );

    return await query.andWhere('winnerId IS NOT NULL').getManyAndCount();
  }
}
