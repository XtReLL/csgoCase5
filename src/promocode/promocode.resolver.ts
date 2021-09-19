import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';
import { CreatePromocodeInput } from './dto/create-promocode.input';
import { UpdatePromocodeInput } from './dto/update-promocode.input';
import { Promocode } from './entity/promocode.entity';
import { PromocodeService } from './promocode.service';

@Resolver('Promocode')
export class PromocodeResolver {
  constructor(private readonly promocodeService: PromocodeService) {}

  @Query('promocodes')
  async promocodes(
    @Authorized() author: AuthorizedModel,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Promocode>> {
    return formatList(
      await this.promocodeService.list(author, pagination),
      `promocodes`,
      pagination,
    );
  }

  @Query('promocode')
  async promocode(
    @Authorized() author: AuthorizedModel,
    @Args('id') promocodeId: string,
  ): Promise<Promocode> {
    return await this.promocodeService.findOne(author, promocodeId);
  }

  @Query('mainPromocode')
  async mainPromocode(
    @Authorized() author: AuthorizedModel,
  ): Promise<Promocode> {
    return await this.promocodeService.getMainPagePromocode();
  }

  @Mutation('createPromocode')
  async createPromocode(
    @Args('createPromocodeInput') createPromocodeInput: CreatePromocodeInput,
    @Authorized() author: AuthorizedModel,
  ): Promise<Promocode> {
    return this.promocodeService.createPromocode(createPromocodeInput, author);
  }

  @Mutation('updatePromocode')
  async updatePromocode(
    @Args('updatePromocodeInput') updatePromocodeInput: UpdatePromocodeInput,
    @Authorized() author: AuthorizedModel,
  ): Promise<Promocode> {
    return this.promocodeService.updatePromocode(updatePromocodeInput, author);
  }

  @Mutation('removePromocode')
  async removePromocode(
    @Args('id') id: string,
    @Authorized() author: AuthorizedModel,
  ): Promise<boolean> {
    return this.promocodeService.removePromocode(id, author);
  }

  @Mutation('usePromocode')
  async usePromocode(
    @Args('code') code: string,
    @Authorized() author: AuthorizedModel,
  ): Promise<boolean> {
    return this.promocodeService.usePromocode(author.model, code);
  }
}
