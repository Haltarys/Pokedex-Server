import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User, UserWithPasswordDocument } from 'src/user/user.schema';

export const CurrentUser = createParamDecorator(
  (data: keyof User | 'id', context: ExecutionContext) => {
    let user: UserWithPasswordDocument;
    const type = context.getType();
    if (type === 'ws') {
      user = context.switchToWs().getClient().handshake.user;
    } else {
      user = context.switchToHttp().getRequest().user;
    }
    return data ? user?.[data] : user;
  },
);
