import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { IPokemon, IPokemonBasic } from 'src/dto/pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  async getPokemonById(id: number): Promise<IPokemon> {
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
          abilities: data.abilities.map((a: any) => a.name),
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
