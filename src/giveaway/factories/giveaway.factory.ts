import { Giveaway } from 'giveaway/entity/giveaway.entity';

import { Factory } from 'typeorm-factory';

export const GiveawayFactory = () =>
  new Factory(Giveaway).attr('endDate', new Date(Date.now() + 864000));
