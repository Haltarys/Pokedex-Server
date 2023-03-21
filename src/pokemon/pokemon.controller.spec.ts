import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

describe('PokemonController', () => {
  let controller: PokemonController;

  beforeEach(async () => {
    const mockPokemonService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
      controllers: [PokemonController],
    })
      .overrideProvider(PokemonService)
      .useValue(mockPokemonService)
      .compile();

    controller = module.get<PokemonController>(PokemonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
