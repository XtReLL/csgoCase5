import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { SearchUserInput } from 'typings/graphql';
import { User } from './entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  processSearchInput(
    builder: SelectQueryBuilder<User>,
    search?: SearchUserInput,
  ): SelectQueryBuilder<User> {
    let resultBuilder = builder;
    if (search?.query) {
      resultBuilder = resultBuilder.andWhere(
        `MATCH(username) AGAINST ('${search.query}*' IN BOOLEAN MODE)`,
      );
    }

    return resultBuilder;
  }
}
