import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AdminRoute } from 'src/auth/decorators/admin-route.decorator';
import { IdParams } from 'src/utils/dto/id.params';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatMessageQuery } from './dto/chat-message.query';

@AdminRoute()
@Controller('chat-messages')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  // No POST route, because chat messages must be created in the chatroom controller

  @Get()
  findAll(@Query() chatMessageQuery: ChatMessageQuery) {
    return this.chatMessageService.findAll(chatMessageQuery);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParams) {
    return this.chatMessageService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdParams, @Body() chatMessageDto: ChatMessageDto) {
    return this.chatMessageService.update(id, chatMessageDto);
  }

  @Delete(':id')
  delete(@Param() { id }: IdParams) {
    return this.chatMessageService.delete(id);
  }
}
