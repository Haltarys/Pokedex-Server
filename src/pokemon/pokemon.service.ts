import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { IPokemon, IPokemonBasic } from 'src/pokemon/dto/pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  async getPokemonById(id: number) {
    // const data = this.httpService
    //   .get(`/pokemon/${id}`)
    //   .pipe(map((res) => res.data));

    const pokemon: Partial<IPokemon> = await firstValueFrom(
      this.httpService.get(`/pokemon/${id}`),
    )
      .then((response) => response.data)
      .then((data: any) => {
        return {
          id,
          types: data.types.map((t: any) => t.type.name),
          img: data.sprites.front_default,
          shinyImg: data.sprites.front_shiny,
          abilities: data.abilities.map((a: any) => a.ability.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        };
      });
    const species: Partial<IPokemon> = await firstValueFrom(
      this.httpService
        .get(`/pokemon-species/${id}`)
        .pipe(map((res) => res.data)),
    ).then((data: any) => {
      return {
        happiness: data.base_happiness,
        descriptions: data.flavor_text_entries
          .filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          )
          .map((e: any) => ({
            lang: e.language.name,
            version: e.version.name,
            value: e.flavor_text,
          })),
        genera: data.genera
          .filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          )
          .map((e: any) => ({
            lang: e.language.name,
            value: e.genus,
          })),
        habitat: data.habitat.name,
        names: data.names
          .filter(
            (e: any) => e.language.name === 'en' || e.language.name === 'fr',
          )
          .map((e: any) => ({
            lang: e.language.name,
            value: e.name,
          })),
      };
    });
    return { ...pokemon, ...species } as IPokemon;
  }

  async getPokemonCard(id: number): Promise<IPokemonBasic> {
    const result: IPokemonBasic = await firstValueFrom(
      this.httpService.get(`/pokemon/${id}`).pipe(map((res: any) => res.data)),
    ).then((data: any) => ({
      id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      img: data.sprites.front_default,
    }));
    return result;
  }
}
