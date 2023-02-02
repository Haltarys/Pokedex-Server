import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { IPokemon, IPokemonBasic } from 'src/models/pokemon.model';

@Injectable()
export class PokemonService implements OnModuleInit {
  @Inject() private readonly config: ConfigService;
  private pokemonApi: string;
  private pokemonApiPokemon: string;
  private pokemonApiSpecies: string;
  public status: 'pending' | 'ready' | 'unavailable' = 'pending';

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.pokemonApi = this.config.get('POKEMON_API') || '';
    this.pokemonApiPokemon = this.config.get('POKEMON_API_POKEMON') || '';
    this.pokemonApiSpecies = this.config.get('POKEMON_API_SPECIES') || '';
    if (this.pokemonApi && this.pokemonApiPokemon && this.pokemonApiSpecies)
      this.status = 'ready';
    else this.status = 'unavailable';
  }

  async getPokemonById(id: number): Promise<IPokemon> {
    if (this.status === 'unavailable') throw new Error('503');
    const pokemon: Partial<IPokemon> | void = await firstValueFrom(
      this.httpService.get(
        `${this.pokemonApi}${this.pokemonApiPokemon}/${id}`,
        {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        },
      ),
    )
      .then((response) => response.data)
      .then((data: any) => {
        return {
          id,
          types: data.types.map((t: any) => t.type.name),
          img: data.sprites.front_default,
          shinyImg: data.sprites.front_shiny,
          abilities: data.abilities.map((a: any) => a.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        };
      })
      .catch((err: Error) => {
        throw new Error('500');
      });
    const species: Partial<IPokemon> | void = await firstValueFrom(
      this.httpService
        .get(`${this.pokemonApi}${this.pokemonApiSpecies}/${id}`, {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        })
        .pipe(map((res) => res.data)),
    )
      .then((data: any) => {
        return {
          happiness: data.happiness,
          descriptions: data.flavor_text_entries.filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          ),
          genera: data.genera.filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          ),
          habitat: data.habitat.name,
          names: data.names.filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          ),
        };
      })
      .catch((err: Error) => {
        throw new Error('500');
      });
    if (!pokemon || !Object.keys(pokemon) || !species || !Object.keys(species))
      throw new Error('204');
    return { ...pokemon, ...species } as IPokemon;
  }

  async getPokemonCard(id: number): Promise<IPokemonBasic> {
    if (this.status === 'unavailable') throw new Error('503');
    const result: IPokemonBasic | void = await firstValueFrom(
      this.httpService
        .get(`${this.pokemonApi}${this.pokemonApiPokemon}/${id}`, {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        })
        .pipe(map((res: any) => res.data)),
    )
      .then((data: any) => ({
        id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        img: data.sprites.front_default,
      }))
      .catch((err: Error) => {
        throw new Error('500');
      });
    if (!result) throw new Error('204');
    return result;
  }
}
