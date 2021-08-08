import { Module } from '@nestjs/common';
import { LiveDropService } from './live-drop.service';
import { LiveDropResolver } from './live-drop.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveDrop } from './entity/live-drop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveDrop])],
  providers: [LiveDropService, LiveDropResolver],
  exports: [LiveDropService],
})
export class LiveDropModule {}
