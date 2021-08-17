import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const port = process.env.PORT || 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(port);

  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [
      process.env.FRONT_URL
        ? process.env.FRONT_URL
        : `http://localhost:${port}`,
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
