import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizedModel } from 'auth/model/authorized.model';

import { Authorized } from 'auth/authorized.decorator';
import { GiveawayService } from './giveaway.service';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { CreateGiveawayInput } from './dto/createGiveawayInput.input';
import { Giveaway } from './entity/giveaway.entity';

@Resolver('giveaway')
export class GiveawayResolver {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Mutation('joinToGiveaway')
  async joinToGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('id') giveawayId: string,
  ): Promise<GiveawayBet> {
    return await this.giveawayService.joinToGiveaway(author.model, giveawayId);
  }

  @Mutation('removeGiveaway')
  async removeGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('id') giveawayId: string,
  ): Promise<boolean> {
    return await this.giveawayService.remove(author.model, giveawayId);
  }

  @Mutation('createGiveaway')
  async createGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('createGiveawayInput') createGiveawayInput: CreateGiveawayInput,
  ): Promise<Giveaway> {
    return await this.giveawayService.create(author.model, createGiveawayInput);
  }

  @Mutation('updateGiveaway')
  async updateGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('createGiveawayInput') createGiveawayInput: CreateGiveawayInput,
  ): Promise<Giveaway> {
    return await this.giveawayService.create(author.model, createGiveawayInput);
  }
}
