/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserDocument } from './user.schema';

export function stripPassword(user: UserDocument) {
  // @ts-ignore
  user.password = undefined;
  // @ts-ignore
  delete user.password;
  return user;
}
