import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ origin: process.env.FRONT_URL })
export class SocketGateway {
  @WebSocketServer()
  public socket!: Server;
  realUsers: any;

  constructor() {
    this.realUsers = {};
  }

  handleDisconnect(socket: Socket) {
    if (
      socket.request.socket.remoteAddress &&
      typeof this.realUsers[socket.request.socket.remoteAddress] !== 'undefined'
    ) {
      delete this.realUsers[socket.request.socket.remoteAddress];
    }

    this.updateOnline();
  }

  handleConnection(socket: Socket) {
    if (
      socket.request.socket.remoteAddress &&
      typeof this.realUsers[socket.request.socket.remoteAddress] === 'undefined'
    ) {
      this.realUsers[socket.request.socket.remoteAddress] = 1;
    }

    this.updateOnline();
  }

  updateOnline() {
    this.socket.emit('online', Object.keys(this.realUsers).length);
  }
}
