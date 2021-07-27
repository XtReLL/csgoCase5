import { CursorBasedPaginationData } from 'typings/graphql';
import { Pagination } from './pagination.input';

export type ListData<T extends { id: string | number }> = {
  data: Array<Omit<T, 'id'> & { id: string }>;
  pagination: CursorBasedPaginationData;
};
export const formatList: <T extends { id: string | number }>(
  items: [T[], number],
  paginationId: string,
  pagination: Pagination | undefined,
) => ListData<T> = (items, paginationId, pagination) => {
  const cursor =
    items[0].length > 0 ? items[0][items[0].length - 1].id : undefined;

  return {
    data: items[0].map(({ id, ...rest }) => ({ id: `${id}`, ...rest })),
    pagination: {
      id: paginationId,
      hasMore: cursor ? items[1] > items[0].length : false,
      cursor: cursor ? `${cursor}` : pagination?.cursor,
    },
  };
};
