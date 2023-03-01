import { ForbiddenException } from '@nestjs/common';

export class ChatroomMemberException extends ForbiddenException {
  constructor() {
    super('Not a member of this chatroom');
  }
}
