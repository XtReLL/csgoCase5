import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { ReferallCode } from './entity/referallCode.entity';
import { ReferallService } from './referall.service';

@Resolver('ReferallCode')
export class ReferallResolver {
  constructor(private readonly referallService: ReferallService) {}
  @Mutation('setReferallCode')
  async setReferallCode(
    @Authorized() author: AuthorizedModel,
    @Args('code') code: string,
  ): Promise<ReferallCode> {
    return await this.referallService.setReferallCode(author.model, code);
  }
}
