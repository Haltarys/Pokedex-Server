import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CanModifyService } from './can-modify.service';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessage, ChatMessageSchema } from './chat-message.schema';
import { ChatMessageService } from './chat-message.service';
import { ChatGateway } from './chat.gateway';
import { ChatroomController } from './chatroom.controller';
import { Chatroom, ChatroomSchema } from './chatroom.schema';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [ChatroomController, ChatMessageController],
  providers: [
    ChatroomService,
    ChatMessageService,
    CanModifyService,
    ChatGateway,
  ],
})
export class ChatModule {}
