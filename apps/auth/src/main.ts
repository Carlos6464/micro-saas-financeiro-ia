/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// Libs compartilhadas (Padronização)
import { HttpExceptionFilter, TransformInterceptor, winstonConfig } from '@backend/common';
import { WinstonModule } from 'nest-winston';

declare const module: any;

async function bootstrap() {
  // 1. Cria a app com Logger customizado (Winston)
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // 2. Configurações Globais
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true 
    })
  );
  
  // Padroniza erros e formato de resposta (data: {})
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Permite fechar conexões graciosamente no reload
  app.enableShutdownHooks(); 

  // 3. Porta: Usa variável AUTH_PORT ou 3001
  const port = process.env.AUTH_PORT || 3001;
  await app.listen(port);

  Logger.log(
    `🚀 Auth Service is running on: http://localhost:${port}/${globalPrefix}`
  );

  // 4. Hot Module Replacement (Recarregamento rápido)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();