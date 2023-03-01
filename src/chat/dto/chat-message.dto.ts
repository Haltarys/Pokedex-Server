import { IsString, Length } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @Length(1, 1024)
  body: string;
}
