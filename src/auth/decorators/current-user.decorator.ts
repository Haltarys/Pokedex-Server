import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User, UserDocument } from 'src/user/user.schema';

export const CurrentUser = createParamDecorator(
  (data: keyof User | 'id', context: ExecutionContext) => {
    let user: UserDocument;
    const type = context.getType();
    if (type === 'ws') {
      user = context.switchToWs().getClient().handshake.user;
    } else {
      user = context.switchToHttp().getRequest().user;
    }
    return data ? user?.[data] : user;
  },
);
