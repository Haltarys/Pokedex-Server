import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('DATABASE_URL'),
      auth: {
        username: this.configService.get<string>('DATABASE_USER'),
        password: this.configService.get<string>('DATABASE_PASSWORD'),
      },
      dbName: 'fs3-pokemon',
      retryWrites: true,
      writeConcern: { w: 'majority' },
    };
  }
}
