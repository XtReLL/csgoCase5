import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Authorized } from 'auth/authorized.decorator';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { ConfigService } from './config.service';
import { UpdateConfigInput } from './dto/update-config.input';
import { Config } from './entity/config.entity';

@Resolver()
export class ConfigResolver {
  constructor(
    private readonly configService: ConfigService
  ) {
    
  }

  @Mutation('updateConfig')
  async usePromocode(
    @Args('updateConfigInput') updateConfigInput: UpdateConfigInput,
    @Authorized() author: AuthorizedModel,
  ): Promise<Config> {
    return this.configService.updateConfig(
      updateConfigInput,
      author,
    );
  }
}
