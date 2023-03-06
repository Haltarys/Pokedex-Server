import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonTeamController } from './pokemon-team.controller';
import { PokemonTeam, PokemonTeamSchema } from './pokemon-team.schema';
import { PokemonTeamService } from './pokemon-team.service';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pokeapi.co/api/v2',
      // headers needed to avoid unexpected end of file error, bug in axios dependency since 1.2
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    }),
    MongooseModule.forFeature([
      { name: PokemonTeam.name, schema: PokemonTeamSchema },
    ]),
  ],
  controllers: [PokemonController, PokemonTeamController],
  providers: [PokemonService, PokemonTeamService],
})
export class PokemonModule {}
