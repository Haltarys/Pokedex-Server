import { IsMongoId, IsOptional } from 'class-validator';

export class ChatroomQuery {
  @IsOptional()
  @IsMongoId()
  authorId?: string;
}
