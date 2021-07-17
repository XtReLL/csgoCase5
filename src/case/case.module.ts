import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Case, CaseItems])],
  providers: [CaseResolver, CaseService],
  exports: [CaseService],
})
export class CaseModule {}
