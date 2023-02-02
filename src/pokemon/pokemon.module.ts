import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pokeapi.co/api/v2',
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    }),
  ],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
