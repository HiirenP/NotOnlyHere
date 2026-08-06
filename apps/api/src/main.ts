import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { StructuredLogger } from './common/structured-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new StructuredLogger(),
  });

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });

  const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
  app.enableCors({
    origin: [webUrl],
    credentials: true,
  });

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
}

bootstrap();
