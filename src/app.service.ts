import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  @Inject() public config: ConfigService;

  getHello(): string {
    return 'Hello World!';
  }
}
