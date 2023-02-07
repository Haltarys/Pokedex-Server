import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { PokemonIdDto } from './dto/pokemon-id.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('partial/:id')
  async findPartialById(@Param() params: PokemonIdDto) {
    try {
      return await this.pokemonService.getPokemonBasic(params.id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  @Get('full/:id')
  async findFullById(@Param() params: PokemonIdDto) {
    try {
      return await this.pokemonService.getPokemonFull(params.id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }
}
