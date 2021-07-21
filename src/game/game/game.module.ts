import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'user/user.module';
import { GameCase } from './entity/game-case.entity';
import { GameCaseResolver } from './game-case.resolver';
import { GameCaseService } from './game-case.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameCase]), forwardRef(() => UserModule)],
  providers: [GameCaseResolver, GameCaseService],
  exports: [GameCaseService],
})
export class GameModule {}
