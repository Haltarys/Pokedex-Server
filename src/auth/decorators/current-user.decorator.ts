import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { getUserFromContext } from 'src/utils/user';

export const CurrentUser = createParamDecorator(
  (data: keyof User | 'id', context: ExecutionContext) => {
    const user = getUserFromContext(context);
    return data ? user?.get(data) : user;
  },
);
