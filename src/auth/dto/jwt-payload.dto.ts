import { IsInt, IsMongoId } from 'class-validator';

export class JwtPayload {
  @IsMongoId()
  sub: string;

  @IsInt()
  iat: number;

  @IsInt()
  exp: number;
}
