import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomService } from './chatroom.service';

describe('ChatroomService', () => {
  let service: ChatroomService;

  beforeEach(async () => {
    const mockChatroomService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatroomService],
    })
      .overrideProvider(ChatroomService)
      .useValue(mockChatroomService)
      .compile();

    service = module.get<ChatroomService>(ChatroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
