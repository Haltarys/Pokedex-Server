import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminRoute } from 'src/auth/decorators/admin-route.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoute } from 'src/auth/decorators/user-route.decorator';
import { UserDocument } from 'src/user/user.schema';
import { IdParams } from 'src/utils/dto/id.params';
import { CanModifyService } from './can-modify.service';
import { ChatMessageService } from './chat-message.service';
import { ChatroomService } from './chatroom.service';
import { ChatMessageIdParams } from './dto/chat-message-id.params';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatroomQuery } from './dto/chatroom.query';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(
    private readonly canModifyService: CanModifyService,
    private readonly chatroomService: ChatroomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @Get()
  findAll() {
    return this.chatroomService.findAll();
  }

  @UserRoute()
  @Get('joined')
  findJoined(@CurrentUser('id') userId: string) {
    return this.chatroomService.findJoinedChatrooms(userId);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParams) {
    return this.chatroomService.findOne(id);
  }

  @AdminRoute()
  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomService.create(createChatroomDto);
  }

  @AdminRoute()
  @Patch(':id')
  update(
    @Param() { id }: IdParams,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    return this.chatroomService.update(id, updateChatroomDto);
  }

  @AdminRoute()
  @Delete(':id')
  delete(@Param() { id }: IdParams) {
    return this.chatroomService.delete(id);
  }

  @AdminRoute()
  @Patch(':id/add-user')
  addUser(
    @Param() { id: chatroomId }: IdParams,
    @Body() { id: userId }: IdParams,
  ) {
    return this.chatroomService.addUser(chatroomId, userId);
  }

  @AdminRoute()
  @Patch(':id/remove-user')
  removeUser(
    @Param() { id: chatroomId }: IdParams,
    @Body() { id: userId }: IdParams,
  ) {
    return this.chatroomService.removeUser(chatroomId, userId);
  }

  @UserRoute()
  @Patch(':id/join')
  join(
    @CurrentUser('id') userId: string,
    @Param() { id: chatroomId }: IdParams,
  ) {
    return this.chatroomService.addUser(chatroomId, userId);
  }

  @UserRoute()
  @Patch(':id/leave')
  async leave(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId }: IdParams,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatroomService.removeUser(chatroomId, user.id);
  }

  @UserRoute()
  @Get(':id/chat-messages')
  async findAllChatMessages(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId }: IdParams,
    @Query() { authorId }: ChatroomQuery,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.findAll({ chatroomId, authorId });
  }

  @UserRoute()
  @Get(':id/chat-messages/:chatMessageId')
  async findOneChatMessage(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId, chatMessageId }: ChatMessageIdParams,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.findOne(chatMessageId);
  }

  @UserRoute()
  @Post(':id/chat-messages')
  async createChatMessage(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId }: IdParams,
    @Body() chatMessageDto: ChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);

    return this.chatMessageService.create(chatMessageDto, user.id, chatroomId);
  }

  @UserRoute()
  @Patch(':id/chat-messages/:chatMessageId')
  async updateChatMessage(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId, chatMessageId }: ChatMessageIdParams,
    @Body() chatMessageDto: ChatMessageDto,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);
    await this.canModifyService.checkChatMessageAuthor(chatMessageId, user);

    return this.chatMessageService.update(chatMessageId, chatMessageDto);
  }

  @UserRoute()
  @Delete(':id/chat-messages/:chatMessageId')
  async deleteChatMessage(
    @CurrentUser() user: UserDocument,
    @Param() { id: chatroomId, chatMessageId }: ChatMessageIdParams,
  ) {
    await this.canModifyService.checkChatroomMember(chatroomId, user);
    await this.canModifyService.checkChatMessageAuthor(chatMessageId, user);

    return this.chatMessageService.delete(chatMessageId);
  }
}
