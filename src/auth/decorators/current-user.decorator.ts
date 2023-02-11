import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserDocument } from 'src/user/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().user as UserDocument,
);
