import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get('Reflector'),
    {
      excludePrefixes: ['_'],
    }
  ));
  // Use AppModule DI container to wrap class-validator call
  // so that we can inject dependencies on our custom
  // validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Config OpenAPI document specification
  const config = new DocumentBuilder()
    .setTitle('Project and Tasks API')
    .setDescription('A simple API to manage projects and tasks leveraging NestJS and Postgres')
    .setVersion('1.0')
    .addTag('projects')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
