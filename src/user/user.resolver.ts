import { Args, Mutation, Parent, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { UserService } from './user.service';


@Resolver('user')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('setTradeLink')
  async setTradeLink(
    @Authorized() author: AuthorizedModel,
    @Args('link') link: string,
  ): Promise<boolean> {
    return await this.userService.setTradeUrl(author.model, link)
  }

}
