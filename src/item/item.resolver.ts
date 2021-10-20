import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Item } from './entity/item.entity';
import { ItemService } from './item.service';

@Resolver('Item')
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @ResolveField('isStatTrak')
  async isStatrack(@Parent() item: Item): Promise<boolean> {
    return /StatTrak/gi.test(item.marketHashName) ? true : false;
  }
}
