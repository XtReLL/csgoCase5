import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { ReferallCode } from 'user/referall/entity/referallCode.entity';
import { ReferallService } from 'user/referall/referall.service';
import { UserLoader } from './user.loader';
import { UserService } from './user.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Loader } from 'nestjs-graphql-dataloader';
import DataLoader from 'dataloader';
import { User } from './entity/user.entity';
import { SearchUserInput } from 'typings/graphql';
import { Pagination } from 'list/pagination.input';
import { formatList, ListData } from 'list/formatter';
import { Inventory } from 'inventory/entity/inventory.entity';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('user')
  findOne(
    @Authorized() auth: AuthorizedModel,
    @Args('id') id: string | undefined,
    @Loader(UserLoader)
    userLoader: DataLoader<User['id'], User>,
  ): Promise<User> {
    return id ? userLoader.load(parseInt(id, 10)) : Promise.resolve(auth.model);
  }

  @Query('users')
  async list(
    @Authorized() auth: AuthorizedModel,
    @Loader(UserLoader)
    userLoader: DataLoader<User['id'], User>,
    @Args('search') search?: SearchUserInput,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<User>> {
    const result = await this.userService.list(auth, search, pagination);
    result[0].forEach((item) => userLoader.prime(item.id, item));
    return formatList(result, 'users', pagination);
  }

  @ResolveField('referallCode')
  async userReferallCode(
    @Authorized() author: AuthorizedModel,
  ): Promise<ReferallCode> {
    return await this.userService.getUserReferallCode(author.model);
  }

  @ResolveField('inventory')
  async userInventory(
    @Authorized() author: AuthorizedModel,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Inventory>> {
    return formatList(
      await this.userService.getUserInventory(author.model, pagination),
      `inventory-user-${author.model.id}`,
      pagination,
    );
  }

  @Mutation('setTradeLink')
  async setTradeLink(
    @Authorized() author: AuthorizedModel,
    @Args('link') link: string,
  ): Promise<boolean> {
    return await this.userService.setTradeUrl(author.model, link);
  }
}
