import { Module } from '@nestjs/common';
import { CreateCommand } from './create-command.runner';
import { MigrationRunnerService } from './migration-runner.service';
import { RunCommand } from './run-command.runner';

@Module({
  providers: [MigrationRunnerService, CreateCommand, RunCommand],
})
export class MigrationRunnerModule {}
