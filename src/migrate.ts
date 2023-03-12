import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function migrate() {
  await CommandFactory.run(AppModule, ['error', 'warn']);
}

migrate();
