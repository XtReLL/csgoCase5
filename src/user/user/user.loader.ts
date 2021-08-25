import { Injectable, Scope } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader extends OrderedNestDataLoader<User['id'], User> {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: Array<User['id']>) => this.userService.byIds(keys),
  });
}
