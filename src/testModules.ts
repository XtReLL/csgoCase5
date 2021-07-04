import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';

export const getTestModules = () => [
  TypeOrmModule.forRoot(config),
];
 