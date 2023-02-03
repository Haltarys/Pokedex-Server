export interface IStat {
  name: string;
  value: number;
}

export type IPokemonTranslation = {
  language: string;
  value: string;
};

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
  descriptions: ({ version: string } & IPokemonTranslation)[];
  genera: IPokemonTranslation[];
  names: IPokemonTranslation[];
  habitat: string;
} & Omit<IPokemonBasic, 'name'>;
