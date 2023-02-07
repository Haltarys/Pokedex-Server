import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PokemonIdDto {
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsPositive()
  id: number;
}
