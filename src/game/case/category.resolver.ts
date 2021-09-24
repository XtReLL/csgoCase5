import { Args, Resolver, Query } from '@nestjs/graphql';

import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';

import { CategoryService } from './category.service';

import { Category } from './entity/category.entity';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query('categories')
  async caseCategories(
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Category>> {
    return formatList(
      await this.categoryService.list(pagination),
      'categories',
      pagination,
    );
  }

  @Query('category')
  async caseCategory(@Args('id') id: string): Promise<Category> {
    return await this.categoryService.findById(id);
  }
}
