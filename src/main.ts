import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
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
  await app.listen(3000);
}
bootstrap();
