import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'local'
        ? ['log', 'fatal', 'error', 'warn', 'debug', 'verbose']
        : ['error', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<string>('SERVER_PORT');

  await app.listen(port);
}
bootstrap();
