import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const type = context.getType();

    if (type === 'ws') {
      const handshake = context.switchToWs().getClient().handshake;
      handshake.headers.authorization = `Bearer ${handshake.auth.jwt}`;
      return handshake;
    } else return context.switchToHttp().getRequest();
  }
}
