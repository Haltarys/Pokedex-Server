import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoute } from 'src/auth/decorators/user-route.decorator';
import { Role } from 'src/user/enums/role.enum';
import { UserDocument } from 'src/user/user.schema';
import { IdParams } from 'src/utils/dto/id.params';
import { CreatePokemonTeamDto } from './dto/create-pokemon-team.dto';
import { PokemonTeamQuery } from './dto/pokemon-team.query';
import { UpdatePokemonTeamDto } from './dto/update-pokemon-team.dto';
import { PokemonTeamOwnerException } from './exceptions/pokemon-team-owner.exception';
import { PokemonTeamService } from './pokemon-team.service';

@UserRoute()
@Controller('pokemon-teams')
export class PokemonTeamController {
  constructor(private readonly pokemonTeamService: PokemonTeamService) {}

  async checkPokemonTeamOwner(pokemonTeamId: string, user: UserDocument) {
    if (
      user.role !== Role.ADMIN &&
      !(await this.pokemonTeamService.isOwner(pokemonTeamId, user.id))
    )
      throw new PokemonTeamOwnerException();
  }

  @Get()
  findAll(
    @CurrentUser() user: UserDocument,
    @Query() { userId }: PokemonTeamQuery,
  ) {
    if (user.role === Role.USER) {
      if (userId) throw new ForbiddenException();

      return this.pokemonTeamService.findAll(user.id);
    }

    return this.pokemonTeamService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: UserDocument,
    @Param() { id: pokemonTeamId }: IdParams,
  ) {
    await this.checkPokemonTeamOwner(pokemonTeamId, user);

    return this.pokemonTeamService.findOne(pokemonTeamId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createPokemonTeamDto: CreatePokemonTeamDto,
  ) {
    return this.pokemonTeamService.create(createPokemonTeamDto, userId);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: UserDocument,
    @Param() { id: pokemonTeamId }: IdParams,
    @Body() updatePokemonTeamDto: UpdatePokemonTeamDto,
  ) {
    await this.checkPokemonTeamOwner(pokemonTeamId, user);

    return this.pokemonTeamService.update(pokemonTeamId, updatePokemonTeamDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: UserDocument,
    @Param() { id: pokemonTeamId }: IdParams,
  ) {
    await this.checkPokemonTeamOwner(pokemonTeamId, user);

    return this.pokemonTeamService.delete(pokemonTeamId);
  }
}
