import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthorizedModel } from 'auth/model/authorized.model';

import { Authorized } from 'auth/authorized.decorator';
import { GiveawayService } from './giveaway.service';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { CreateGiveawayInput } from './dto/createGiveawayInput.input';
import { Giveaway } from './entity/giveaway.entity';
import { Pagination } from 'list/pagination.input';
import { formatList, ListData } from 'list/formatter';
import { arch } from 'os';
import { SearchGiveawayInput } from 'typings/graphql';

@Resolver('giveaway')
export class GiveawayResolver {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Query('giveaways')
  async giveaways(
    @Authorized() author: AuthorizedModel,
    @Args('pagination') pagination?: Pagination,
    @Args('search') search?: SearchGiveawayInput,
  ): Promise<ListData<Giveaway>> {
    return formatList(
      await this.giveawayService.list(author, pagination, search),
      `giveaways`,
      pagination,
    );
  }

  @Query('giveaway')
  async giveaway(
    @Authorized() author: AuthorizedModel,
    @Args('id') giveawayId: string,
  ): Promise<Giveaway> {
    return await this.giveawayService.findOne(giveawayId);
  }

  @Mutation('joinToGiveaway')
  async joinToGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('id') giveawayId: string,
  ): Promise<GiveawayBet> {
    return await this.giveawayService.joinToGiveaway(
      author.model,
      parseInt(giveawayId, 10),
    );
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
    return await this.giveawayService.create(createGiveawayInput);
  }

  @Mutation('updateGiveaway')
  async updateGiveaway(
    @Authorized() author: AuthorizedModel,
    @Args('createGiveawayInput') createGiveawayInput: CreateGiveawayInput,
  ): Promise<Giveaway> {
    return await this.giveawayService.create(createGiveawayInput);
  }
}
