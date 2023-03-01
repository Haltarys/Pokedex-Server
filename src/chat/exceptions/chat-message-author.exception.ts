import { ForbiddenException } from '@nestjs/common';

export class ChatMessageAuthorException extends ForbiddenException {
  constructor() {
    super('Not the author of this message');
  }
}
