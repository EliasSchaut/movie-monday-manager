import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import helmet from 'helmet';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from '@/common/exceptions/filter/prisma.exception_filter';
import { AllExceptionFilter } from '@/common/exceptions/filter/all.exception_filter';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
          styleSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
          scriptSrc: ["'self'", "https: 'unsafe-inline'", "'unsafe-eval'"],
          objectSrc: ["'self'"],
          defaultSrc: [`'self'`],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  return app;
}

export default async function get_http_adapter_instance() {
  const app = await createApp();
  await app.init();
  return app.getHttpAdapter().getInstance();
}
