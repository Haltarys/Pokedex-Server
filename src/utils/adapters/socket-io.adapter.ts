import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    appOrHttpServer?: INestApplicationContext | any,
    private readonly cors: string | string[] = '*',
  ) {
    super(appOrHttpServer);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, { cors: this.cors, ...options });
    return server;
  }
}
