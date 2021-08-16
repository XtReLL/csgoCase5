import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from 'game/game/game.module';
import { InventoryModule } from 'inventory/inventory.module';
import { LiveDropModule } from 'live-drop/live-drop.module';
import { PaybackSystemModule } from 'payback-system/payback-system.module';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { UserModule } from 'user/user.module';
import { CaseResolver } from './case.resolver';
import { CaseService } from './case.service';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { Category } from './entity/category.entity';
import { CategoryCase } from './entity/category_case.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, CaseItems, Category, CategoryCase]),
    forwardRef(() => UserModule),
    forwardRef(() => GameModule),
    RedisCacheModule,
    forwardRef(() => PaybackSystemModule),
    LiveDropModule,
    InventoryModule,
  ],
  providers: [CaseResolver, CaseService],
  exports: [CaseService],
})
export class CaseModule {}
