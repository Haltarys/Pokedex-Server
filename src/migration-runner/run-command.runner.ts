import { Command, CommandRunner } from 'nest-commander';
import { MigrationRunnerService } from './migration-runner.service';

@Command({
  name: 'run',
  description: 'run all migrations',
})
export class RunCommand extends CommandRunner {
  constructor(private readonly migrationRunnerService: MigrationRunnerService) {
    super();
  }

  async run() {
    await this.migrationRunnerService.run();
  }
}
