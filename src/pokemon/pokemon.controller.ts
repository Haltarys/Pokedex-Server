import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { PokemonIdDto } from './dto/pokemon-id.dto';
import { IPokemonBasic } from './dto/pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('full/:id')
  async findFullById(@Param() params: PokemonIdDto) {
    try {
      return await this.pokemonService.getPokemonById(params.id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  @Get('partial/:id')
  async findPartialById(@Param() params: PokemonIdDto): Promise<IPokemonBasic> {
    try {
      return await this.pokemonService.getPokemonCard(params.id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }
}
