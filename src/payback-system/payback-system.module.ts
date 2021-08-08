import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseModule } from 'game/case/case.module';
import { LiveDrop } from 'live-drop/entity/live-drop.entity';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { CasePaybackSystemService } from './case/casePaybackSystem.service';
import { PaybackSystemResolver } from './payback-system.resolver';
import { PaybackSystemService } from './payback-system.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveDrop]), forwardRef(() => CaseModule)],
  providers: [
    PaybackSystemResolver,
    PaybackSystemService,
    CasePaybackSystemService,
  ],
  exports: [PaybackSystemService, CasePaybackSystemService],
})
export class PaybackSystemModule {}
