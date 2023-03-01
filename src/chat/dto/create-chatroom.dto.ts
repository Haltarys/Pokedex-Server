import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId({ each: true })
  members: string[] = [];
}
