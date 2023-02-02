import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { IPokemon, IPokemonBasic } from 'src/models/pokemon.model';

@Injectable()
export class PokemonService {
  @Inject() private readonly config: ConfigService;

  constructor(private readonly httpService: HttpService) {}

  async getPokemonById(id: number): Promise<IPokemon> {
    const pokemonApi = this.config.get('POKEMON_API');
    const pokemonApiPokemon = this.config.get('POKEMON_API_POKEMON');
    const pokemonApiSpecies = this.config.get('POKEMON_API_SPECIES');
    const pokemon: Partial<IPokemon> | void = await firstValueFrom(
      this.httpService.get(`${pokemonApi}${pokemonApiPokemon}/${id}`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      })
    )
      .then((response) => response.data)
      .then((data: any) => {
        // console.log('=========== POKEMON ==========');
        // console.log(data);
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
      .catch((err: Error) => console.error(err));
    const species: Partial<IPokemon> | void = await firstValueFrom(
      this.httpService.get(`${pokemonApi}${pokemonApiSpecies}/${id}`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      }).pipe(map(res => res.data)),
    )
      .then((data: any) => {
        // console.log('=========== SPECIES ==========');
        // console.log(data);
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
      .catch((err: Error) => console.error(err));
    if (!pokemon || !Object.keys(pokemon) || !species || !Object.keys(species))
      throw new Error('Data not loaded');
    return { ...pokemon, ...species } as IPokemon;
  }

  async getPokemonCard(id: number): Promise<IPokemonBasic> {
    const pokemonApi = this.config.get('POKEMON_API');
    const pokemonApiPokemon = this.config.get('POKEMON_API_POKEMON');
    const result: IPokemonBasic | void = await firstValueFrom(
      this.httpService
        .get(`${pokemonApi}${pokemonApiPokemon}/${id}`, {
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
      .catch((err: Error) => console.error(err));
    if (!result) throw new Error('Data not loaded');
    return result;
  }
}
