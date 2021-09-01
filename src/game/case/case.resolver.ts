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
import { OnlyAdmins } from 'auth/only-admins.decorator';
import { Item } from 'item/entity/item.entity';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';

import { CaseService } from './case.service';
import { AddItemsInCaseInput } from './dto/addItemsInCase.input';
import { CreateCaseInput } from './dto/createCase.input';
import { OpenCaseInput } from './dto/openCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
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
    @OnlyAdmins() author: AuthorizedModel,
    @Args('createCaseInput') createCaseInput: CreateCaseInput,
  ): Promise<Case> {
    return await this.caseService.create(createCaseInput, author);
  }

  @Mutation('updateCase')
  async updateCase(
    @OnlyAdmins() author: AuthorizedModel,
    @Args('updateCaseInput') updateCaseInput: UpdateCaseInput,
  ): Promise<Case> {
    return await this.caseService.update(updateCaseInput, author);
  }

  @Mutation('removeCase')
  async removeCase(
    @OnlyAdmins() author: AuthorizedModel,
    @Args('id') caseId: string,
  ): Promise<boolean> {
    return await this.caseService.remove(caseId, author);
  }

  @Mutation('addItemsInCase')
  async addItemsInCase(
    @OnlyAdmins() author: AuthorizedModel,
    @Args('addItemsInCaseInput') addItemsInCaseInput: AddItemsInCaseInput,
  ): Promise<CaseItems[]> {
    return await this.caseService.addItemsInCase(addItemsInCaseInput);
  }

  @Mutation('openCase')
  async openCase(
    @Authorized() author: AuthorizedModel,
    @Args('openCaseInput') openCaseInput: OpenCaseInput,
  ): Promise<Item[]> {
    const result = await this.caseService.open(openCaseInput, author);

    if (!result) {
      throw "Couldn't get a win";
    }
    return result;
  }
}
