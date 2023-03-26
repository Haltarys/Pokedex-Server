import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs/promises';
import type { Db } from 'mongodb';
import { Connection } from 'mongoose';

@Injectable()
export class MigrationRunnerService {
  constructor(@InjectConnection() private connection: Connection) {}

  private static readonly content = `\
  exports.default = async (
    /** @type {import('mongodb').Db} */
    db,
  ) => {
    console.debug(db.databaseName);
    await db.collection('users').find().toArray().then(console.debug);
  };
  `.replace(/^ {2}/g, '');

  async create(name: string) {
    try {
      await fs.writeFile(
        `./src/migrations/${Date.now()}_${name}.js`,
        MigrationRunnerService.content,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async run() {
    const filepaths = await fs.readdir(__dirname + '/../migrations');
    const session = await this.connection.startSession();

    for (const filepath of filepaths) await this.migrate(filepath);

    await session.endSession();
  }

  private async migrate(filepath: string) {
    const migration: (db: Db) => Promise<void> = (
      await import(__dirname + '/../migrations/' + filepath)
    ).default;

    console.debug(`Running migration ${filepath}...`);
    await migration(this.connection.db);
  }
}
