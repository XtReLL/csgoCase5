import { CursorBasedPaginationData } from 'typings/graphql';

export type ListData<T extends { id: string | number }> = {
  data: Array<Omit<T, 'id'> & { id: string }>;
  pagination: CursorBasedPaginationData;
};
export const formatList: <T extends { id: string | number }>(
  items: [T[], number],
  paginationId: string,
) => ListData<T> = (items, paginationId) => {
  const cursor =
    items[0].length > 0 ? items[0][items[0].length - 1].id : undefined; 

  return {
    data: items[0].map(({ id, ...rest }) => ({ id: `${id}`, ...rest })),
    pagination: {
      id: paginationId,
      hasMore: cursor ? items[1] > items[0].length : false,
      cursor: cursor ? `${cursor}` : (cursor as undefined),
    },
  };
}; 
