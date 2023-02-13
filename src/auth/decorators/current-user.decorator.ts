import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User, UserDocument } from 'src/user/user.schema';

export const CurrentUser = createParamDecorator(
  (data: keyof User | 'id', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserDocument;
    return data ? user?.[data] : user;
  },
);
