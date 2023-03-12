import { App } from './init';

async function bootstrap() {
  const app = await App.init();

  await app.start();
}

bootstrap();
