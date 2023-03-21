import { Test, TestingModule } from '@nestjs/testing';
import { MigrationRunnerService } from './migration-runner.service';

describe('MigrationRunnerService', () => {
  let service: MigrationRunnerService;

  beforeEach(async () => {
    const mockMigrationRunnerService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [MigrationRunnerService],
    })
      .overrideProvider(MigrationRunnerService)
      .useValue(mockMigrationRunnerService)
      .compile();

    service = module.get<MigrationRunnerService>(MigrationRunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
