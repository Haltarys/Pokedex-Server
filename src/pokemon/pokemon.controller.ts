import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { IPokemon, IPokemonBasic } from 'src/dto/pokemon.dto';
import { PokemonHttpExceptionFilter } from './httpException.filter';

import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@UseFilters(PokemonHttpExceptionFilter)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  initRequest(id: number) {
    if (id < 1) {
      throw new HttpException(
        'Id must be a positive number greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('full/:id')
  async findFullById(@Param('id', ParseIntPipe) id: number): Promise<IPokemon> {
    this.initRequest(id);
    try {
      return await this.pokemonService.getPokemonById(id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  @Get('partial/:id')
  async findPartialById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IPokemonBasic> {
    this.initRequest(id);
    try {
      return await this.pokemonService.getPokemonCard(id);
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }
}
