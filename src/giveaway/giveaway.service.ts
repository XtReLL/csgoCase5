import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryService } from 'inventory/inventory.service';
import { Repository } from 'typeorm';
import { User } from 'user/entity/user.entity';
import { CreateGiveawayInput } from './dto/createGiveawayInput.input';
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
        itemId: parseInt(createGiveawayInput.itemId, 10),
        endDate: createGiveawayInput.endDate,
      }),
    );
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
}
