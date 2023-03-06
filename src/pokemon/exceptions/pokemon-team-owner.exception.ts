import { ForbiddenException } from '@nestjs/common';

export class PokemonTeamOwnerException extends ForbiddenException {
  constructor() {
    super('Not the owner of this pokemon team');
  }
}
