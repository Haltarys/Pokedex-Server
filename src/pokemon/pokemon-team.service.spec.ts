import { Test, TestingModule } from '@nestjs/testing';
import { PokemonTeamService } from './pokemon-team.service';

describe('PokemonTeamService', () => {
  let service: PokemonTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonTeamService],
    }).compile();

    service = module.get<PokemonTeamService>(PokemonTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
