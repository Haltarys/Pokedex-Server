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

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new MongoUniqueFieldFilter());

  const launchConfigService = app.get(LaunchConfigService);

  app.enableCors({ origin: launchConfigService.corsOrigin });

  const httpServer = launchConfigService.isProduction
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      https.createServer(launchConfigService.httpsOptions!, server)
    : http.createServer(server);

  const adapter = new SocketIoAdapter(
    httpServer,
    launchConfigService.corsOrigin,
  );
  app.useWebSocketAdapter(adapter);

  await app.init();
  httpServer.listen(launchConfigService.port);
}

bootstrap();
