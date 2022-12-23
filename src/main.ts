import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": '*',
    "credentials": true
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('MEDCORD Apis Open API')
    .setDescription('This is the documentation for the MEDCORD project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http', scheme: 'bearer', bearerFormat: 'JWT'
      },
      'access-token')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
