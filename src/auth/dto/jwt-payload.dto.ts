import { IsMongoId } from 'class-validator';

export class JwtPayload {
  @IsMongoId()
  sub: string;
}
