import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { User } from 'src/user/user.schema';

@Schema({ versionKey: false, toJSON: { virtuals: true } })
export class PokemonTeam {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [Number], required: true, default: [] })
  pokemons: number[];
}

export type PokemonTeamDocument = HydratedDocument<PokemonTeam>;

export const PokemonTeamSchema = SchemaFactory.createForClass(PokemonTeam);
