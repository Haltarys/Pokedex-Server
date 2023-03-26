import { UnauthorizedException, UseFilters, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoute } from 'src/auth/decorators/user-route.decorator';
import type { UserDocument } from 'src/user/user.schema';
import { WsValidationFilter } from 'src/utils/filters/ws-validation.filter';
import { CustomValidationPipe } from 'src/utils/pipes/custom-validation.pipe';
import { CanModifyService } from './can-modify.service';
import { ChatMessageService } from './chat-message.service';
import { ChatroomService } from './chatroom.service';
import type {
  WsCreateChatMessageDto,
  WsDeleteChatMessageDto,
  WsFindAllChatMessagesDto,
  WsFindOneChatMessageDto,
  WsJoinChatroomDto,
  WsLeaveChatroomDto,
  WsUpdateChatMessageDto,
} from './dto/ws-chat';

@UsePipes(CustomValidationPipe)
@UseFilters(WsValidationFilter)
@UserRoute()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly canModifyService: CanModifyService,
    private readonly chatroomService: ChatroomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @WebSocketServer()
  io: Server;

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const payload = await this.authService.validateJwt(
      socket.handshake.auth.jwt,
    );
    if (!payload) {
      socket.emit('login_error', new UnauthorizedException());
      socket.disconnect(true);
    }
    const joinedChatrooms = await this.chatroomService.findJoinedChatrooms(
      payload.sub,
    );
    socket.join(joinedChatrooms.map((chatroom) => chatroom.id));
  }

  @SubscribeMessage('join-chatroom')
  async joinChatroom(
    @CurrentUser('id') userId: string,
    @MessageBody() { path: { id: chatroomId } }: WsJoinChatroomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chatroom = await this.chatroomService.addUser(chatroomId, userId);
    if (chatroom) socket.join(chatroom.id);

    return chatroom;
  }

  @SubscribeMessage('leave-chatroom')
  async leaveChatroom(
    @CurrentUser() user: UserDocument,
    @MessageBody() { path: { id: chatroomId } }: WsLeaveChatroomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    const chatroom = await this.chatroomService.removeUser(chatroomId, user.id);
    socket.leave(chatroomId);

    return chatroom;
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

    const chatMessage = await this.chatMessageService.create(
      chatMessageDto,
      user.id,
      chatroomId,
    );

    this.io.to(chatroomId).emit('chat-message-created', chatMessage);
    return chatMessage;
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

    const chatMessage = await this.chatMessageService.update(
      chatMessageId,
      chatMessageDto,
    );
    this.io.to(chatroomId).emit('chat-message-updated', chatMessage);
    return chatMessage;
  }

  @SubscribeMessage('delete-chat-message')
  async deleteChatMessage(
    @CurrentUser() user: UserDocument,
    @MessageBody()
    { path: { id: chatroomId, chatMessageId } }: WsDeleteChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);
    await this.canModifyService.checkChatMessageAuthor(chatMessageId, user);

    const deleted = await this.chatMessageService.delete(chatMessageId);
    this.io.to(chatroomId).emit('chat-message-deleted', chatMessageId);
    return deleted;
  }
}
