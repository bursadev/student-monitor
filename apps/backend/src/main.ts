import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route lives under /api so the web app can proxy or rewrite cleanly.
  app.setGlobalPrefix('api');

  // The clients are separate origins (Next on :3000, Expo on a LAN address),
  // and both send an Authorization header rather than cookies.
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
