import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from 'inventory/inventory.module';
import { User } from 'user/entity/user.entity';
import { GiveawayBet } from './entity/giveaway-bet.entity';
import { Giveaway } from './entity/giveaway.entity';
import { GiveawayResolver } from './giveaway.resolver';
import { GiveawayService } from './giveaway.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Giveaway, User, GiveawayBet]),
    InventoryModule,
  ],
  providers: [GiveawayResolver, GiveawayService],
  exports: [GiveawayService],
})
export class GiveawayModule {}
