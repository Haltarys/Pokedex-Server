import { OmitType } from '@nestjs/mapped-types';
import { PokemonBasicDto } from './pokemon-basic.dto';
import { PokemonStatDto } from './pokemon-stat.dto';
import { PokemonTranslationDto } from './pokemon-translation.dto';

export class PokemonFullDto extends OmitType(PokemonBasicDto, [
  'name',
] as const) {
  shinyImg: string;
  abilities: string[];
  stats: PokemonStatDto[];
  happiness: number;
  descriptions: Array<PokemonTranslationDto & { version: string }>;
  genera: PokemonTranslationDto[];
  names: PokemonTranslationDto[];
  habitat: string;
}
