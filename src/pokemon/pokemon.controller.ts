import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import type { PokemonIdParams } from './dto/pokemon-id.params';
import { PokemonService } from './pokemon.service';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('partial/:id')
  async findPartialById(@Param() { id }: PokemonIdParams) {
    try {
      return await this.pokemonService.getPokemonBasic(id);
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpException(
          err.response?.statusText ?? 'Unknown HTTP error',
          err.response?.status ?? HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Get('full/:id')
  async findFullById(@Param() { id }: PokemonIdParams) {
    try {
      return await this.pokemonService.getPokemonFull(id);
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpException(
          err.response?.statusText ?? '',
          err.response?.status ?? HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
