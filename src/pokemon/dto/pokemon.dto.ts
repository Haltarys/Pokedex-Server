export interface IStat {
  name: string;
  value: number;
}

export interface IPokemonTranslation {
  language: string;
  value: string;
}

export type IPokemonBasic = {
  id: number;
  name: string;
  types: string[];
  img: string;
};

export type IPokemon = {
  shinyImg: string;
  abilities: string[];
  stats: IStat[];
  happiness: number;
  descriptions: IPokemonTranslation[];
  genera: IPokemonTranslation[];
  names: IPokemonTranslation[];
  habitat: string;
} & Omit<IPokemonBasic, 'name'>;
