import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { AppModule } from './app.module';
import { LaunchConfigService } from './config/launch-config.service';
import { SocketIoAdapter } from './utils/adapters/socket-io.adapter';
import { CustomValidationPipe } from './utils/pipes/custom-validation.pipe';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(new CustomValidationPipe());

  const launchConfigService = app.get(LaunchConfigService);

  app.enableCors({ origin: launchConfigService.corsOrigin });

  if (launchConfigService.isProduction) {
    const httpsServer = https.createServer(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      launchConfigService.httpsOptions!,
      server,
    );

    const adapter = new SocketIoAdapter(
      httpsServer,
      launchConfigService.corsOrigin,
    );
    app.useWebSocketAdapter(adapter);
    await app.init();
    httpsServer.listen(launchConfigService.port);
  } else {
    const httpServer = http.createServer(server);
    const adapter = new SocketIoAdapter(
      httpServer,
      launchConfigService.corsOrigin,
    );
    app.useWebSocketAdapter(adapter);
    await app.init();
    httpServer.listen(launchConfigService.port);
  }
}

bootstrap();
