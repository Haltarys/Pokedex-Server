import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { WsParams } from 'src/utils/dto/ws.params';
import { ChatMessageIdParams } from '../chat-message-id.params';
import { ChatMessageDto } from '../chat-message.dto';

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
