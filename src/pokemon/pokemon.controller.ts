import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { PokemonIdParams } from './dto/pokemon-id.params';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('partial/:id')
  async findPartialById(@Param() { id }: PokemonIdParams) {
    try {
      return await this.pokemonService.getPokemonBasic(id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  @Get('full/:id')
  async findFullById(@Param() { id }: PokemonIdParams) {
    try {
      return await this.pokemonService.getPokemonFull(id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }
}
