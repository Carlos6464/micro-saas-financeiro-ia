/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

import { HttpExceptionFilter, TransformInterceptor } from '@backend/common';

import { WinstonModule} from 'nest-winston'
import { winstonConfig} from '@backend/common'



async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig)
  });

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  
  
}

bootstrap();
