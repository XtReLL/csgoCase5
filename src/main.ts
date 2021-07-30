import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigFactory } from 'config/factories/config.factory';
import { AppModule } from './app.module';

const port = process.env.PORT || 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
