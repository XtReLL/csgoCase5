import { Resolver } from '@nestjs/graphql';

import { GiveawayService } from './giveaway.service';

@Resolver('GiveawayBet')
export class GiveawayBetResolver {
  constructor(private readonly giveawayService: GiveawayService) {}
}
