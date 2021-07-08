import { Config } from 'config/entity/config.entity';

import { Factory } from 'typeorm-factory';


export const ConfigFactory = () =>
  new Factory(Config)
    .attr('siteName', 'TestConfig')
