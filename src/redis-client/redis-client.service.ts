import { Injectable } from '@nestjs/common';
import { RedisService } from "nestjs-redis";
import * as Redis from 'ioredis';

@Injectable()
export class RedisClientService {
    private service: Redis.Redis 

    constructor(
        private readonly redisService: RedisService,
    ) {
        this.service = this.redisService.getClient('app')
    }

    async get(key: string) {
        const data = await this.service.get(key)

        if (!data) {
            return null
        }

        return JSON.parse(data)
    }

    async set(key: string, value: any) {
        return await this.service.set(key, JSON.stringify(value))
    }

    async delete(key: string) {
        return await this.service.del(key)
    }

    // async lrange(key: string, start: number, stop: number) {
    //     return await this.service.lrange(key, start, stop)
    // }

    // async rpush(key: string, data: any) {
    //     return await this.service.rpush(key, JSON.stringify(data))
    // }

    // async lrem(key: string, count: number, data: any) {
    //     return await this.service.lrem(key, count, JSON.stringify(data))
    // }
}
