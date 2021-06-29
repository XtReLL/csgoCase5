import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientModule } from 'redis-client/redis-client.module';
import { User } from './entity/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisClientModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
}) 
export class UserModule {}
 