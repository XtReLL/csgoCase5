import { Module } from '@nestjs/common';
import { ReferallService } from './referall.service';
import { ReferallResolver } from './referall.resolver';
import { User } from 'user/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferallCode } from './entity/referallCode.entity';
import { ReferallUser } from './entity/referallUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReferallCode, ReferallUser])],
  providers: [ReferallService, ReferallResolver],
  exports: [ReferallService],
})
export class ReferallModule {}
