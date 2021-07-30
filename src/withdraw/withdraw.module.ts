import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawItem } from './entity/withdrawItem.entity';
import { WithdrawResolver } from './withdraw.resolver';
import { WithdrawService } from './withdraw.service';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawItem])],
  providers: [WithdrawResolver, WithdrawService],
  exports: [WithdrawService],
})
export class WithdrawModule {}
