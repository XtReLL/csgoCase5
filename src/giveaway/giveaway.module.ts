import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from 'inventory/inventory.module';
import { ItemModule } from 'item/item.module';
import { User } from 'user/user/entity/user.entity';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { Giveaway } from './entity/giveaway.entity';
import { GiveawayListener } from './giveaway.listener';
import { GiveawayResolver } from './giveaway.resolver';
import { GiveawayService } from './giveaway.service';
import { GiveawayBetResolver } from './giveawayBet.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Giveaway, User, GiveawayBet]),
    InventoryModule,
    ItemModule,
  ],
  providers: [
    GiveawayResolver,
    GiveawayService,
    GiveawayListener,
    GiveawayBetResolver,
  ],
  exports: [GiveawayService],
})
export class GiveawayModule {}
