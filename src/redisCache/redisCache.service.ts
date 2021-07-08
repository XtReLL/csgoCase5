import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, options?: any) {
    await this.cache.set(key, value, options);
  }

  async delete(key: string, callback: (err: any) => void) {
    await this.cache.del(key, callback);
  }
}
