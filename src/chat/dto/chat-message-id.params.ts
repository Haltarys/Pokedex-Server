import { IsMongoId } from 'class-validator';
import { IdParams } from 'src/utils/dto/id.params';

export class ChatMessageIdParams extends IdParams {
  @IsMongoId()
  chatMessageId: string;
}
