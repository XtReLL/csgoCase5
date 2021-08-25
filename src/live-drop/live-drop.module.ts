import { Module } from '@nestjs/common';
import { LiveDropService } from './live-drop.service';
import { LiveDropResolver } from './live-drop.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveDrop } from './entity/live-drop.entity';
import { SocketModule } from 'socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([LiveDrop]), SocketModule],
  providers: [LiveDropService, LiveDropResolver],
  exports: [LiveDropService],
})
export class LiveDropModule {}
