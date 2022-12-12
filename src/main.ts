import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as process from "process";
const { version } = require('./../package.json')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "https://www.gravatar.com", "validator.swagger.io"],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        objectSrc: ["'self'"],
        defaultSrc: [`'self'`],
      }
    },
    crossOriginEmbedderPolicy: false
  }));
  const config = new DocumentBuilder()
    .setTitle(`${process.env.PROJECT_NAME} Api Documentation`)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  await app.listen(process.env.PORT as string);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
