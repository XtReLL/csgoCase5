import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Item } from 'item/entity/item.entity';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';

import { CaseService } from './case.service';
import { CreateCaseInput } from './dto/createCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { Category } from './entity/category.entity';

@Resolver('Case')
export class CaseResolver {
  constructor(private readonly caseService: CaseService) {}

  @ResolveField('categories')
  async caseCategories(@Parent() box: Case): Promise<Category[]> {
    return await this.caseService.getCaseCategories(box);
  }

  @ResolveField('items')
  async caseItems(@Parent() box: Case): Promise<Item[]> {
    return await this.caseService.getCaseItems(box);
  }

  @Query('cases')
  async cases(
    @Authorized() author: AuthorizedModel,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Case>> {
    return formatList(
      await this.caseService.list(author, pagination),
      `cases`,
      pagination,
    );
  }

  @Query('case')
  async case(
    @Authorized() author: AuthorizedModel,
    @Args('id') caseId: string,
  ): Promise<Case> {
    return await this.caseService.findOne(author, caseId);
  }

  @Mutation('createCase')
  async createCase(
    @Authorized() author: AuthorizedModel,
    @Args('createCaseInput') createCaseInput: CreateCaseInput,
  ): Promise<Case> {
    return await this.caseService.create(createCaseInput, author);
  }

  @Mutation('updateCase')
  async updateCase(
    @Authorized() author: AuthorizedModel,
    @Args('updateCaseInput') updateCaseInput: UpdateCaseInput,
  ): Promise<Case> {
    return await this.caseService.update(updateCaseInput, author);
  }

  @Mutation('removeCase')
  async removeCase(
    @Authorized() author: AuthorizedModel,
    @Args('id') caseId: string,
  ): Promise<boolean> {
    return await this.caseService.remove(caseId, author);
  }
}
