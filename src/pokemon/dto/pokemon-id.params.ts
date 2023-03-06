import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class PokemonIdParams {
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsPositive()
  @IsInt()
  id: number;
}
