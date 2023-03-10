import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import type { ServerOptions } from 'https';

@Injectable()
export class LaunchConfigService {
  public readonly isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = configService.get<string>('NODE_ENV') === 'production';
  }

  get port(): number {
    return (
      this.configService.get<number>('PORT') || (this.isProduction ? 443 : 3001)
    );
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN') || '*';
  }

  get httpsOptions(): ServerOptions | null {
    return this.isProduction
      ? {
          key: readFileSync('./ssl/key.pem'),
          cert: readFileSync('./ssl/cert.pem'),
        }
      : null;
  }
}
