import { InputType } from '@nestjs/graphql';

@InputType()
export class Pagination {
  cursor?: string;
  offset?: number;
  limit!: number;
  direction!: 'desc' | 'asc';
}

export const defaultPagination: Pagination = {
  limit: 10,
  direction: 'desc',
};
