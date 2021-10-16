import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';

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
}
