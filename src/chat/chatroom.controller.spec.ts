import { Test, TestingModule } from '@nestjs/testing';
import { CanModifyService } from './can-modify.service';
import { ChatMessageService } from './chat-message.service';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

describe('ChatroomController', () => {
  let controller: ChatroomController;

  beforeEach(async () => {
    const mockCanModifyService = {};
    const mockChatroomService = {};
    const mockChatMessageService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanModifyService, ChatroomService, ChatMessageService],
      controllers: [ChatroomController],
    })
      .overrideProvider(CanModifyService)
      .useValue(mockCanModifyService)
      .overrideProvider(ChatroomService)
      .useValue(mockChatroomService)
      .overrideProvider(ChatMessageService)
      .useValue(mockChatMessageService)
      .compile();

    controller = module.get<ChatroomController>(ChatroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
