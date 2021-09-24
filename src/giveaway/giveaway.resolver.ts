import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthorizedModel } from 'auth/model/authorized.model';

import { Authorized } from 'auth/authorized.decorator';
import { GiveawayService } from './giveaway.service';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { CreateGiveawayInput } from './dto/createGiveawayInput.input';
import { Giveaway } from './entity/giveaway.entity';
import { Pagination } from 'list/pagination.input';
import { formatList, ListData } from 'list/formatter';

import { SearchGiveawayInput } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Loader } from 'nestjs-graphql-dataloader';
import { UserLoader } from 'user/user/user.loader';
import DataLoader from 'dataloader';

@Resolver('Giveaway')
export class GiveawayResolver {
  constructor(private readonly giveawayService: GiveawayService) {}

  @ResolveField('giveawayBets')
  async caseCategories(
    @Parent() parent: Giveaway,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<GiveawayBet>> {
    const [giveawayBets, count] = await this.giveawayService.giveawayBets(
      parent,
      pagination,
    );
    return formatList(
      [giveawayBets, count],
      `giveaway_bets_${parent.id}`,
      pagination,
    );
  }

  @ResolveField('participants')
  async participants(
    @Parent() parent: Giveaway,
    @Loader(UserLoader)
    userLoader: DataLoader<User['id'], User>,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<User>> {
    const [giveawayBets, count] = await this.giveawayService.participants(
      parent,
      pagination,
    );
    const users = (await userLoader.loadMany(
      giveawayBets.map((item) => item.userId),
    )) as User[];
    return formatList([users, count], `giveaway_bets_${parent.id}`, pagination);
  }

  @Query('giveaways')
  async giveaways(
    @Args('pagination') pagination?: Pagination,
    @Args('search') search?: SearchGiveawayInput,
  ): Promise<ListData<Giveaway>> {
    return formatList(
      await this.giveawayService.list(pagination, search),
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
