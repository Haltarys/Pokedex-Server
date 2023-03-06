import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonTeamDto } from './dto/create-pokemon-team.dto';
import { UpdatePokemonTeamDto } from './dto/update-pokemon-team.dto';
import { PokemonTeam, PokemonTeamDocument } from './pokemon-team.schema';

@Injectable()
export class PokemonTeamService {
  constructor(
    @InjectModel(PokemonTeam.name)
    private pokemonTeamModel: Model<PokemonTeamDocument>,
  ) {}

  async findAll(userId?: string): Promise<PokemonTeamDocument[]> {
    return this.pokemonTeamModel.find({ user: userId }).exec();
  }

  async findOne(id: string): Promise<PokemonTeamDocument | null> {
    return this.pokemonTeamModel.findById(id).exec();
  }

  async create(
    createPokemonTeamDto: CreatePokemonTeamDto,
    userId: string,
  ): Promise<PokemonTeamDocument> {
    const pokemonTeam = new this.pokemonTeamModel({
      ...createPokemonTeamDto,
      user: userId,
    });

    return pokemonTeam.save();
  }

  async update(
    id: string,
    updatePokemonTeamDto: UpdatePokemonTeamDto,
  ): Promise<PokemonTeamDocument | null> {
    return this.pokemonTeamModel
      .findByIdAndUpdate(id, updatePokemonTeamDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    return this.pokemonTeamModel
      .findByIdAndDelete(id)
      .exec()
      .then((user) => !!user);
  }

  async isOwner(pokemonTeamId: string, userId: string): Promise<boolean> {
    return this.pokemonTeamModel
      .exists({ _id: pokemonTeamId, user: userId })
      .exec()
      .then((pokemonTeam) => !!pokemonTeam);
  }
}
