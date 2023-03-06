import { IsMongoId, IsOptional } from 'class-validator';

export class PokemonTeamQuery {
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
