import { ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';

export function getUserFromContext(context: ExecutionContext): UserDocument {
  const type = context.getType();
  if (type === 'ws') {
    return context.switchToWs().getClient().handshake.user;
  } else {
    return context.switchToHttp().getRequest().user;
  }
}
