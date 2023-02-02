import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Res } from '@nestjs/common';
import { IPokemon, IPokemonBasic } from 'src/models/pokemon.model';

import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  checkServiceStatus() {
    return this.pokemonService.status === 'ready';
  }

  initRequest(id: number) {
    if (!this.checkServiceStatus()) {
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'PokeApi is not ready to be use, please try again later'
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    if (id < 1) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Id must be a positive number greater than 0',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('full/:id')
  findFullById(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response): Promise<IPokemon> {
    this.initRequest(id);
    try {
      return this.pokemonService.getPokemonById(id);
    } catch(err) {
      const status = err.message;
      throw new HttpException({
        status,
        error: status === '204' ? 'No data for this id' : 'Internal Server Error'
      }, status);
    }
  }

  @Get('partial/:id')
  findPartialById(@Param('id', ParseIntPipe) id: number): Promise<IPokemonBasic> {
    this.initRequest(id);
    try {
      return this.pokemonService.getPokemonCard(id);
    } catch(err) {
      const status = err.message;
      throw new HttpException({
        status,
        error: status === '204' ? 'No data for this id' : 'Internal Server Error'
      }, status);
    }
  }
}
