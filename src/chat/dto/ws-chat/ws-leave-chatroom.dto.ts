import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { IdParams } from 'src/utils/dto/id.params';
import { WsParams } from 'src/utils/dto/ws.params';

export class WsLeaveChatroomDto implements WsParams {
  @IsNotEmptyObject() // Workaround to ensure nested validation
  @ValidateNested()
  @Type(() => IdParams)
  path: IdParams;
}
