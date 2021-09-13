import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from 'ormconfig';
import { TradeModule } from './trade/trade.module';
import { PromocodeModule } from './promocode/promocode.module';
import { ConfigModule } from './config/config.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { ItemModule } from './item/item.module';
import { CsgoMarketModule } from './csgo-market/csgo-market.module';
import { BackpackApiModule } from './backpack-api/backpack-api.module';
import { InventoryModule } from './inventory/inventory.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CaseModule } from './game/case/case.module';
import { GameModule } from './game/game/game.module';
import { GiveawayModule } from './giveaway/giveaway.module';
import { PaymentModule } from './payment/payment.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { PaybackSystemModule } from './payback-system/payback-system.module';
import { LiveDropModule } from './live-drop/live-drop.module';
import { SocketModule } from './socket/socket.module';
import { SocketGateway } from './socket/socket.gateway';
import { APP_INTERCEPTOR } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DataLoaderInterceptor } from 'nestjs-graphql-dataloader';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot({
      debug: true,
      playground: {
        endpoint: process.env.APP_URL + '/graphql',
        settings: {
          ['request.credentials']: 'same-origin',
        },
      },
      introspection: true,
      tracing: true,
      typePaths: ['**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'typings/src/graphql.ts'),
        outputAs: 'interface',
      },
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    TradeModule,
    PromocodeModule,
    ConfigModule,
    RedisCacheModule,
    ItemModule,
    CsgoMarketModule,
    BackpackApiModule,
    InventoryModule,
    CaseModule,
    GameModule,
    GiveawayModule,
    PaymentModule,
    WithdrawModule,
    PaybackSystemModule,
    LiveDropModule,
    SocketModule,
  ],
  providers: [
    SocketGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AppModule {}
