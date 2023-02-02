import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  @Inject() public config: ConfigService;

  getHello(): string {
    const databaseName: string = this.config.get('DATABASE_NAME') || '';
    console.log(process.env.NODE_ENV);
    console.log({ databaseName });
    return 'Hello World!';
  }
}
