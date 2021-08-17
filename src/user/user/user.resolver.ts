import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { ReferallCode } from 'user/referall/entity/referallCode.entity';
import { ReferallService } from 'user/referall/referall.service';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField('referallCode')
  async userReferallCode(
    @Authorized() author: AuthorizedModel,
  ): Promise<ReferallCode> {
    return await this.userService.getUserReferallCode(author.model);
  }

  @Mutation('setTradeLink')
  async setTradeLink(
    @Authorized() author: AuthorizedModel,
    @Args('link') link: string,
  ): Promise<boolean> {
    return await this.userService.setTradeUrl(author.model, link);
  }
}
