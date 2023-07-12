import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_DOC_USER]: process.env.SWAGGER_DOC_PASSWORD,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fudy')
    .setDescription('Simple user authentication API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
