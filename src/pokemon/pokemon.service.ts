import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { combineLatestWith, lastValueFrom, map } from 'rxjs';
import { PokemonFullDto } from 'src/pokemon/dto/pokemon-full.dto';
import { PokemonBasicDto } from './dto/pokemon-basic.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  async getPokemonBasic(id: number) {
    return lastValueFrom<PokemonBasicDto>(
      this.httpService.get(`/pokemon/${id}`).pipe(
        map(({ data }) => ({
          id,
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
          img: data.sprites.front_default,
        })),
      ),
    );
  }

  async getPokemonFull(id: number) {
    const pokemonObservable = this.httpService.get(`/pokemon/${id}`).pipe(
      map(({ data }) => ({
        id,
        types: data.types.map((t: any) => t.type.name),
        img: data.sprites.front_default,
        shinyImg: data.sprites.front_shiny,
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      })),
    );

    const filterEnFr = (e: any) =>
      e.language.name === 'en' || e.language.name === 'fr';

    const speciesObservable = this.httpService
      .get(`/pokemon-species/${id}`)
      .pipe(
        map(({ data }) => {
          return {
            happiness: data.base_happiness,
            descriptions: data.flavor_text_entries
              .filter(filterEnFr)
              .map((e: any) => ({
                lang: e.language.name,
                version: e.version.name,
                value: e.flavor_text,
              })),
            genera: data.genera.filter(filterEnFr).map((e: any) => ({
              lang: e.language.name,
              value: e.genus,
            })),
            habitat: data.habitat?.name || '',
            names: data.names.filter(filterEnFr).map((e: any) => ({
              lang: e.language.name,
              value: e.name,
            })),
          };
        }),
      );

    return lastValueFrom<PokemonFullDto>(
      pokemonObservable.pipe(
        combineLatestWith(speciesObservable),
        map(([pokemon, species]) =>
          Object.assign(new PokemonFullDto(), pokemon, species),
        ),
      ),
    );
  }
}
