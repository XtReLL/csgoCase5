import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';
import { Inventory } from './entity/inventory.entity';

import { InventoryService } from './inventory.service';

@Resolver('Inventory')
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation('sellItem')
  async sellItem(
    @Args('itemIds') itemIds: number[],
    @Authorized() author: AuthorizedModel,
  ): Promise<boolean> {
    return this.inventoryService.sellItem(itemIds, author.model);
  }

  @Query('getUserInventoryHistory')
  async getUserInventoryHistory(
    @Authorized() author: AuthorizedModel,
    @Args('userId') userId: number,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Inventory>> {
    return formatList(
      await this.inventoryService.getUserInventoryHistory(userId, pagination),
      `inventoryHistory-user-${userId}`,
      pagination,
    );
  }
}
