import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { ItemService } from './item.service';

@Resolver('Item')
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}
}
