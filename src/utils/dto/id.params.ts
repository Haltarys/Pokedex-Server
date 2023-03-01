import { IsMongoId } from 'class-validator';

export class IdParams {
  @IsMongoId()
  id: string;
}
