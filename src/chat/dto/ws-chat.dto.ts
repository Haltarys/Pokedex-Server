import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { IdParams } from 'src/utils/dto/id.params';
import { WsParams } from 'src/utils/dto/ws.params';
import { ChatMessageIdParams } from './chat-message-id.params';
import { ChatMessageDto } from './chat-message.dto';
import { ChatroomQuery } from './chatroom.query';

export class WsFindAllChatMessagesDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => IdParams)
  path: IdParams;

  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatroomQuery)
  body: ChatroomQuery;
}

export class WsFindOneChatMessageDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatMessageIdParams)
  path: ChatMessageIdParams;
}

export class WsCreateChatMessageDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => IdParams)
  path: IdParams;

  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatMessageDto)
  body: ChatMessageDto;
}

export class WsUpdateChatMessageDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatMessageIdParams)
  path: ChatMessageIdParams;

  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatMessageDto)
  body: ChatMessageDto;
}

export class WsDeleteChatMessageDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => ChatMessageIdParams)
  path: ChatMessageIdParams;
}
