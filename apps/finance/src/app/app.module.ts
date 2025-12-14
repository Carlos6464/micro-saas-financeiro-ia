import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BackendDatabaseModule } from '@backend/database';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importamos os Módulos de Funcionalidade
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    // 1. Configuração Global
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. Banco de Dados
    BackendDatabaseModule.forRoot('DB_NAME_FINANCE'),
    
    // 3. Nossos Módulos (Features)
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}