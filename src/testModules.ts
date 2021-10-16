import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { RedisCacheModule } from 'redisCache/redisCache.module';

export const getTestModules = () => [
  TypeOrmModule.forRoot(config),
  EventEmitterModule.forRoot({
    maxListeners: 200,
  }),
  RedisCacheModule,
];
