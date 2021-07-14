import { Module } from '@nestjs/common';
import { BackpackApiService } from './backpack-api.service';
import { BackpackApiResolver } from './backpack-api.resolver';

@Module({
  providers: [BackpackApiService, BackpackApiResolver],
  exports: [BackpackApiService],
})
export class BackpackApiModule {}
