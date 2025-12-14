/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// Libs compartilhadas (Mesma padronização do Auth)
import { HttpExceptionFilter, TransformInterceptor, winstonConfig } from '@backend/common';
import { WinstonModule } from 'nest-winston';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true 
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  app.enableShutdownHooks();

  // Porta: Usa variável FINANCE_PORT ou 3002
  const port = process.env.FINANCE_PORT || 3002;
  await app.listen(port);

  Logger.log(
    `🚀 Auth Service is running on: http://localhost:${port}/${globalPrefix}`
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();