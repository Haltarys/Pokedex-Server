import { IsMongoId } from 'class-validator';

export class UserIdParams {
  @IsMongoId()
  id: string;
}
