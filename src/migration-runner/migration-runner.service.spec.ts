import { Test, TestingModule } from '@nestjs/testing';
import { MigrationRunnerService } from './migration-runner.service';

describe('MigrationRunnerService', () => {
  let service: MigrationRunnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MigrationRunnerService],
    }).compile();

    service = module.get<MigrationRunnerService>(MigrationRunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
