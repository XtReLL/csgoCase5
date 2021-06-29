import { Module } from '@nestjs/common'
import {RedisClientService} from "./redis-client.service"

@Module({
    exports: [RedisClientService],
    providers: [RedisClientService]
})
export class RedisClientModule {}
