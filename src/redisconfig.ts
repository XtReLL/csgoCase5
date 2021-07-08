import { CacheManagerOptions, CacheModuleOptions } from '@nestjs/common';

export const config: CacheModuleOptions = {
  host: 'redis',
  port: 6379,
  ttl: 15 * 60,
};
