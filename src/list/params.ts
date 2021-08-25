import {
  Brackets,
  FindConditions,
  FindManyOptions,
  LessThan,
  MoreThan,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Pagination } from './pagination.input';

type BaseEntity = { createdAt: Date; id: string | number };
export const paramsToQuery = async <T extends BaseEntity>(
  repo: Repository<T>,
  pagination: Pagination,
  additionalWhere: FindConditions<T> = {},
  sortColumn: keyof T = 'createdAt',
  cursorColumn: keyof T = 'id',
): Promise<Partial<FindManyOptions<T>>> => {
  const cursorEntity = pagination.cursor
    ? await repo.findOne({
        ...additionalWhere,
        [cursorColumn]: pagination.cursor,
      })
    : null;

  return {
    take: pagination.limit,
    skip: pagination.offset,
    order: { [sortColumn]: pagination.direction.toUpperCase() as any } as any,
    where: {
      ...additionalWhere,
      ...(cursorEntity
        ? {
            [sortColumn]:
              pagination.direction === 'desc'
                ? LessThan(cursorEntity[sortColumn])
                : MoreThan(cursorEntity[sortColumn]),
          }
        : {}),
    },
  };
};

export const paramsToBuilder = async <T extends BaseEntity>(
  builder: SelectQueryBuilder<T>,
  pagination: Pagination,
  sortColumn: keyof T = 'createdAt',
  cursorColumn: keyof T = 'id',
  sortByNonUniqueCustomColumn?: boolean,
  findedCursorEntity: T | null = null,
): Promise<SelectQueryBuilder<T>> => {
  const cursorEntity =
    sortByNonUniqueCustomColumn && pagination.cursor
      ? findedCursorEntity
        ? findedCursorEntity
        : await builder
            .clone()
            .where(`${cursorColumn} = :cursor`, { cursor: pagination.cursor })
            .getRawOne()
      : null;

  let tempBuilder = builder
    .limit(pagination.limit)
    .orderBy(sortColumn as string, pagination.direction.toUpperCase() as any);

  if (sortByNonUniqueCustomColumn) {
    tempBuilder = tempBuilder.addOrderBy(
      cursorColumn as string,
      pagination.direction.toUpperCase() as any,
    );
  }

  if (pagination.offset) {
    tempBuilder = tempBuilder.offset(pagination.offset);
  }

  // Теперь в дальнейшем можно везде вызывать andWhere
  tempBuilder = tempBuilder.where('1 = 1');

  if (pagination.cursor) {
    if (!sortByNonUniqueCustomColumn) {
      tempBuilder = tempBuilder.andWhere(
        `${cursorColumn} ${
          pagination.direction === 'desc' ? '<' : '>'
        } :cursor`,
        { cursor: parseInt(pagination.cursor, 10) },
      );
    } else {
      tempBuilder = tempBuilder.andWhere(
        new Brackets((qb) =>
          qb
            .where(
              `${sortColumn} ${
                pagination.direction === 'desc' ? '<' : '>'
              } :cursor`,
              { cursor: cursorEntity![sortColumn] },
            )
            .orWhere(
              `${sortColumn} = :cursor and ${cursorColumn}${
                pagination.direction === 'desc' ? '<' : '>'
              } :cursorColumn`,
              { cursorColumn: cursorEntity![cursorColumn] },
            ),
        ),
      );
    }
  }

  return tempBuilder;
};
