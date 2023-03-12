import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { AppModule } from './app.module';
import { LaunchConfigService } from './config/launch-config.service';
import { SocketIoAdapter } from './utils/adapters/socket-io.adapter';
import { MongoUniqueFieldFilter } from './utils/filters/mongo-unique-field.filter';
import { CustomValidationPipe } from './utils/pipes/custom-validation.pipe';

export class App {
  private httpServer?: http.Server | https.Server;

  private constructor(
    public readonly app: INestApplication,
    private readonly server: express.Express,
  ) {}

  static async init() {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.useGlobalPipes(new CustomValidationPipe());
    app.useGlobalFilters(new MongoUniqueFieldFilter());
    app.enableCors({ origin: app.get(LaunchConfigService).corsOrigin });

    return new App(app, server);
  }

  async start() {
    const launchConfigService = this.app.get(LaunchConfigService);

    this.httpServer = launchConfigService.isProduction
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        https.createServer(launchConfigService.httpsOptions!, this.server)
      : http.createServer(this.server);

    const adapter = new SocketIoAdapter(
      this.httpServer,
      launchConfigService.corsOrigin,
    );
    this.app.useWebSocketAdapter(adapter);

    await this.app.init();
    this.httpServer.listen(launchConfigService.port);
  }
}
