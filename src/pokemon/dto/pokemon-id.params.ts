import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PokemonIdParams {
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsPositive()
  id: number;
}
