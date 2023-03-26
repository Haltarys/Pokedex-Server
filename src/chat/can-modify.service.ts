import { Injectable } from '@nestjs/common';
import { Role } from 'src/user/enums/role.enum';
import { UserDocument } from 'src/user/user.schema';
import { ChatMessageService } from './chat-message.service';
import { ChatroomService } from './chatroom.service';
import { ChatMessageAuthorException } from './exceptions/chat-message-author.exception';
import { ChatroomMemberException } from './exceptions/chatroom-member.exception';

@Injectable()
export class CanModifyService {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  async checkChatroomMember(chatroomId: string, user: UserDocument) {
    if (
      user.role !== Role.ADMIN &&
      !(await this.chatroomService.isMember(chatroomId, user.id))
    )
      throw new ChatroomMemberException();
  }

  async checkChatMessageAuthor(chatMessageId: string, user: UserDocument) {
    if (
      user.role !== Role.ADMIN &&
      !(await this.chatMessageService.isAuthor(chatMessageId, user.id))
    )
      throw new ChatMessageAuthorException();
  }
}
