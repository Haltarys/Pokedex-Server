import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, NotEquals, ValidateIf } from 'class-validator';
import { CreateChatroomDto } from './create-chatroom.dto';

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {
  @ValidateIf((o, v) => v !== undefined) // Hack to make @NotEquals(null) work
  @NotEquals(null)
  @IsMongoId({ each: true })
  members: string[];
}
