import { IsMongoId, IsOptional } from 'class-validator';

export class ChatMessageQuery {
  @IsOptional()
  @IsMongoId()
  chatroomId?: string;

  @IsOptional()
  @IsMongoId()
  authorId?: string;
}
