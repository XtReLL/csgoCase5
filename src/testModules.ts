import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';

export const getTestModules = () => [
  TypeOrmModule.forRoot(config),
  EventEmitterModule.forRoot({
    maxListeners: 200,
  }),
];
