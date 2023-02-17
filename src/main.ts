import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { AppModule } from './app.module';
import { LaunchConfigService } from './config/launch-config.service';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const launchConfigService = app.get(LaunchConfigService);

  app.enableCors({ origin: launchConfigService.corsOrigin });

  await app.init();
  if (launchConfigService.isProduction) {
    https
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .createServer(launchConfigService.httpsOptions!, server)
      .listen(launchConfigService.port);
  } else {
    http.createServer(server).listen(launchConfigService.port);
  }
}

bootstrap();
