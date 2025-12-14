import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from './auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}), // Registramos o módulo JWT para o middleware usar
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // ----------------------------------------------------
    // 1. APLICAR AUTENTICAÇÃO (AuthMiddleware)
    // ----------------------------------------------------
    // Protege todas as rotas de Finanças e Usuários
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/v1/finance/(.*)', method: RequestMethod.ALL },
        { path: 'api/v1/users/(.*)', method: RequestMethod.ALL } 
        // Note: Não proteja 'api/v1/auth', pois é login/registro público
      );

    // ----------------------------------------------------
    // 2. CONFIGURAR PROXIES
    // ----------------------------------------------------
    
    // --> Proxy para AUTH SERVICE (Login, Register) - Público
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${process.env.AUTH_PORT || 3001}`,
          changeOrigin: true,
        })
      )
      .forRoutes('api/v1/auth');

    // --> Proxy para USERS (Profile) - Protegido (AuthMiddleware já rodou)
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${process.env.AUTH_PORT || 3001}`,
          changeOrigin: true,
        })
      )
      .forRoutes('api/v1/users');

    // --> Proxy para FINANCE SERVICE - Protegido (AuthMiddleware já rodou)
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${process.env.FINANCE_PORT || 3002}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1/finance': '', // Remove prefixo para o serviço
          },
        })
      )
      .forRoutes('api/v1/finance');
  }
}