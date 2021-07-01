import { Module } from '@nestjs/common';


import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from 'ormconfig';
import { RedisModule } from 'nestjs-redis';
import { RedisClientService } from 'redis-client/redis-client.service';
import { TradeModule } from './trade/trade.module';


@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      playground: {
        endpoint: process.env.APP_URL + '/graphql',
        settings: {
          ['request.credentials']: 'same-origin',
        }
      },
      introspection: true,
      tracing: true,
      typePaths: ['**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'typings/src/graphql.ts'),
        outputAs: 'interface',
      },
    }),
    RedisModule.register({
      host: 'redis',
      name: 'app',
      port: 6379
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    TradeModule,
  ],
  providers: [
    RedisClientService,
  ],
})
export class AppModule {}
