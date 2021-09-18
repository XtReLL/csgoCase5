import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiveawayModule } from 'giveaway/giveaway.module';
import { ItemModule } from 'item/item.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { ConfigResolver } from './config.resolver';
import { ConfigService } from './config.service';
import { Config } from './entity/config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config]),
    RedisCacheModule,
    ItemModule,
    GiveawayModule,
  ],
  providers: [ConfigResolver, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
