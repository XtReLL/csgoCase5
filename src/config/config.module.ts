import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { ConfigResolver } from './config.resolver';
import { ConfigService } from './config.service';
import { Config } from './entity/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Config]), RedisCacheModule],
  providers: [ConfigResolver, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
