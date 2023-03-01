import { UnauthorizedException, UseFilters, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoute } from 'src/auth/decorators/user-route.decorator';
import { UserDocument } from 'src/user/user.schema';
import { WsValidationFilter } from 'src/utils/filters/ws-validation.filter';
import { CustomValidationPipe } from 'src/utils/pipes/custom-validation.pipe';
import { CanModifyService } from './can-modify.service';
import { ChatMessageService } from './chat-message.service';
import {
  WsCreateChatMessageDto,
  WsDeleteChatMessageDto,
  WsFindAllChatMessagesDto,
  WsFindOneChatMessageDto,
  WsUpdateChatMessageDto,
} from './dto/ws-chat.dto';

@UsePipes(CustomValidationPipe)
@UseFilters(WsValidationFilter)
@UserRoute()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly canModifyService: CanModifyService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    if (!(await this.authService.validateJwt(client.handshake.auth.jwt))) {
      client.emit('login_error', new UnauthorizedException());
      client.disconnect(true);
    }
  }

  @SubscribeMessage('find-all-chat-messages')
  async findAllChatMessages(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    { path: { id: chatroomId }, body: { authorId } }: WsFindAllChatMessagesDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.findAll({ chatroomId, authorId });
  }

  @SubscribeMessage('find-one-chat-message')
  async findOneChatMessage(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    { path: { id: chatroomId, chatMessageId } }: WsFindOneChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.findOne(chatMessageId);
  }

  @SubscribeMessage('create-chat-message')
  async createChatMessage(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    { path: { id: chatroomId }, body: chatMessageDto }: WsCreateChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.create(chatMessageDto, user.id, chatroomId);
  }

  @SubscribeMessage('update-chat-message')
  async updateChatMessage(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    {
      path: { id: chatroomId, chatMessageId },
      body: chatMessageDto,
    }: WsUpdateChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);
    await this.canModifyService.checkChatMessageAuthor(chatMessageId, user);

    return this.chatMessageService.update(chatMessageId, chatMessageDto);
  }

  @SubscribeMessage('delete-chat-message')
  async deleteChatMessage(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    { path: { id: chatroomId, chatMessageId } }: WsDeleteChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);
    await this.canModifyService.checkChatMessageAuthor(chatMessageId, user);

    return this.chatMessageService.delete(chatMessageId);
  }
}
