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
    JwtModule.register({}), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // ----------------------------------------------------
    // 1. APLICAR AUTENTICAÇÃO (AuthMiddleware)
    // ----------------------------------------------------
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/v1/finance/(.*)', method: RequestMethod.ALL },
        { path: 'api/v1/users/(.*)', method: RequestMethod.ALL } 
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
          pathRewrite: (path) => {
            console.log(`[Proxy Auth] Caminho recebido: ${path}`);
            
            // Se o caminho já vier "limpo" como /register, adicionamos /auth
            if (!path.startsWith('/api/v1/auth')) {
               return `/auth${path}`; 
            }
            
            // Se vier completo, fazemos a substituição padrão
            return path.replace('/api/v1/auth', '/auth');
          },
        })
      )
      .forRoutes('api/v1/auth');

    // --> Proxy para USERS (Profile) - Protegido
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${process.env.AUTH_PORT || 3001}`,
          changeOrigin: true,
          pathRewrite: {
            // CORREÇÃO: Remove /api/v1, mas mantém /users
            // Ex: /api/v1/users/profile -> /users/profile
            '^/api/v1/users': '/users',
          },
        })
      )
      .forRoutes('api/v1/users');

    // --> Proxy para FINANCE SERVICE - Protegido
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${process.env.FINANCE_PORT || 3002}`,
          changeOrigin: true,
          pathRewrite: {
            // Aqui removemos tudo porque o finance geralmente assume a raiz ou controller próprio
            '^/api/v1/finance': '', 
          },
        })
      )
      .forRoutes('api/v1/finance');
  }
}