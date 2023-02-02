import { Controller, Get, Param } from '@nestjs/common';
import { IPokemon, IPokemonBasic } from 'src/models/pokemon.model';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('full/:id')
  findById(@Param('id') id: number): Promise<IPokemon> {
    console.log(`[/pokemon] Getting full data for : ${id}`);
    return this.pokemonService.getPokemonById(id);
  }

  @Get('partial/:id')
  findBasicData(@Param('id') id: number): Promise<IPokemonBasic> {
    console.log(`[/pokemon] Getting basic data for : ${id}`);
    return this.pokemonService.getPokemonCard(id);
  }
}
