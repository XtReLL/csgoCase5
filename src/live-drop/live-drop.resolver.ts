import { Args, Query, Resolver } from '@nestjs/graphql';
import { formatList, ListData } from 'list/formatter';
import { Pagination } from 'list/pagination.input';
import { ItemsCountByQuality } from 'typings/graphql';
import { SearchLiveDropInput } from './dto/searchLiveDrop.input';
import { LiveDrop } from './entity/live-drop.entity';
import { LiveDropService } from './live-drop.service';

@Resolver('LiveDrop')
export class LiveDropResolver {
  constructor(private readonly liveDropService: LiveDropService) {}
  @Query('liveDrops')
  async liveDrops(
    @Args('pagination') pagination?: Pagination,
    @Args('search') search?: SearchLiveDropInput,
  ): Promise<ListData<LiveDrop>> {
    return formatList(
      await this.liveDropService.getLiveDrop(pagination, search),
      search?.caseId ? `liveDrops_caseId_${search?.caseId}` : `liveDrops`,
      pagination,
    );
  }

  @Query('itemsCountByQuality')
  async itemsCountByQuality(): Promise<void> {}
}
