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
import { CategoryService } from './category.service';
import { CreateCaseInput } from './dto/createCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { Category } from './entity/category.entity';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query('categories')
  async caseCategories(
    @Authorized() author: AuthorizedModel,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Category>> {
    return formatList(
      await this.categoryService.list(author, pagination),
      'categories',
      pagination,
    );
  }

  @Query('category')
  async caseCategory(
    @Args('id') id: string,
    @Authorized() author: AuthorizedModel,
  ): Promise<Category> {
    return await this.categoryService.findById(id);
  }

  @Query('casesStats')
  async casesStats(@Authorized() author: AuthorizedModel): Promise<void> {}
}
