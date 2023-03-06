import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreatePokemonTeamDto {
  @IsString()
  name: string;

  @IsPositive({ each: true })
  @IsInt({ each: true })
  pokemons: number[] = [];
}
