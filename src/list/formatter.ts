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
  const data = items[0].filter((item) => !!item);
  const cursor = data.length > 0 ? data[data.length - 1].id : undefined;

  return {
    data: data.map((item) =>
      Object.assign(Object.create(Object.getPrototypeOf(item)), item, {
        id: `${item.id}`,
      }),
    ),
    pagination: {
      id: paginationId,
      hasMore: cursor ? items[1] > data.length : false,
      cursor: cursor ? `${cursor}` : pagination?.cursor,
      total: items[1],
    },
  };
};
