import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from 'game/game/game.module';
import { UserModule } from 'user/user.module';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, CaseItems]),
    forwardRef(() => UserModule),
    forwardRef(() => GameModule),
  ],
  providers: [CaseResolver, CaseService],
  exports: [CaseService],
})
export class CaseModule {}
