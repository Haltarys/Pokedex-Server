import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsPositive, NotEquals, ValidateIf } from 'class-validator';
import { CreatePokemonTeamDto } from './create-pokemon-team.dto';

export class UpdatePokemonTeamDto extends PartialType(CreatePokemonTeamDto) {
  @ValidateIf((o, v) => v !== undefined) // Hack to make @NotEquals(null) work
  @NotEquals(null)
  @IsPositive({ each: true })
  @IsInt({ each: true })
  pokemons: number[];
}
