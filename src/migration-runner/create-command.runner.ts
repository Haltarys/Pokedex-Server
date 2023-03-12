import { Command, CommandRunner } from 'nest-commander';
import { MigrationRunnerService } from './migration-runner.service';

@Command({
  name: 'create',
  arguments: '<name>',
  description: 'create a new migration',
})
export class CreateCommand extends CommandRunner {
  constructor(private readonly migrationRunnerService: MigrationRunnerService) {
    super();
  }

  async run(passedParams: string[]) {
    await this.migrationRunnerService.create(passedParams[0]);
  }
}
