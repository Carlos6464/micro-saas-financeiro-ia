import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BackendDatabaseModule } from '@backend/database';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Guard Global
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // 1. Configurações Globais
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. Banco de Dados
    BackendDatabaseModule.forRoot('DB_NAME_AUTH'),
    
    // 3. Módulos de Funcionalidade
    UsersModule, // Gerencia Entidades e CRUD de usuário
    AuthModule,  // Gerencia Login, Tokens e Estratégias
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Mantemos o Guard Global aqui para proteger a aplicação inteira
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}