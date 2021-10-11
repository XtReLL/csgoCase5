import { Args, Resolver, Query } from '@nestjs/graphql';

import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';

import { Category } from './entity/category.entity';
import { Tag } from './entity/tag.entity';
import { TagService } from './tag.service';

@Resolver('Tag')
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query('tags')
  async caseTags(
    @Args('pagination') pagination?: Pagination,
  ): Promise<ListData<Tag>> {
    return formatList(
      await this.tagService.list(pagination),
      'tags',
      pagination,
    );
  }

  @Query('tag')
  async caseTag(@Args('id') id: string): Promise<Tag> {
    return await this.tagService.findById(id);
  }
}
